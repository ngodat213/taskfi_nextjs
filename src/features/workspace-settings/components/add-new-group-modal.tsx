import { Users, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
;
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextarea } from "@/components/ui/forms/form-textarea";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { LogoPicker } from "@/components/ui/forms/logo-picker";
import {
  useCreateGroup,
  useUpdateGroup,
} from "@/features/workspace-settings/hooks/use-groups";
import { uploadService } from "@/services/upload.service";
import { Group } from "@/types/group.types";
import { useTranslations } from "next-intl";
import {
  groupSchema,
  GroupFormData,
} from "@/features/workspace-settings/schema/group.schema";
import { TRANSLATION_KEYS } from "@/constants/translations";

export function AddNewGroupModal({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Group | null;
}) {
  const t = useTranslations("WorkspaceSettings");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createGroup, isPending: isCreating } = useCreateGroup();
  const { mutate: updateGroup, isPending: isUpdating } = useUpdateGroup();
  const isLoading = isCreating || isUpdating || isUploading;

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      if (initialData) {
        resetForm({
          name: initialData.name,
          description: initialData.description || "",
        });
        setLogoPreview(initialData.logoUrl || "");
      } else {
        resetForm({
          name: "",
          description: "",
        });
        setLogoPreview("");
      }
      setLogoFile(null);
    }
  }

  const reset = () => {
    resetForm();
    setLogoFile(null);
    if (logoPreview && logoPreview.startsWith("blob:")) {
      URL.revokeObjectURL(logoPreview);
    }
    setLogoPreview("");
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const onSubmit = async (data: GroupFormData) => {
    let logoUrl: string | undefined = initialData?.logoUrl;
    if (logoFile) {
      try {
        setIsUploading(true);
        const uploadRes = await uploadService.uploadImage(logoFile);
        if (uploadRes.success && uploadRes.data?.url) {
          logoUrl = uploadRes.data.url;
        }
      } catch (err) {
        console.error("Failed to upload logo:", err);
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
      logoUrl,
    };

    if (isEditMode && initialData) {
      updateGroup(
        { groupId: initialData.id, data: payload },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      createGroup(payload, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={
              isEditMode
                ? t(TRANSLATION_KEYS.modals.addGroup.titleUpdate)
                : t(TRANSLATION_KEYS.modals.addGroup.titleCreate)
            }
            icon={<Users className="w-4 h-4" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={
                isEditMode
                  ? t(TRANSLATION_KEYS.modals.addGroup.subtitleUpdate)
                  : t(TRANSLATION_KEYS.modals.addGroup.subtitleCreate)
              }
              description={
                isEditMode
                  ? t(TRANSLATION_KEYS.modals.addGroup.descUpdate)
                  : t(TRANSLATION_KEYS.modals.addGroup.descCreate)
              }
            >
              <div className="flex flex-col gap-5">
                <LogoPicker
                  previewUrl={logoPreview}
                  changeLabel={t(TRANSLATION_KEYS.actions.change)}
                  onChange={(file) => {
                    setLogoFile(file);
                    setLogoPreview(URL.createObjectURL(file));
                  }}
                />

                <FormInput
                  label={t(TRANSLATION_KEYS.modals.addGroup.nameLabel)}
                  required
                  autoFocus
                  type="text"
                  placeholder={t(
                    TRANSLATION_KEYS.modals.addGroup.namePlaceholder,
                  )}
                  {...register("name")}
                  className="h-10 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                  error={errors.name?.message}
                />

                <FormTextarea
                  label={t(TRANSLATION_KEYS.modals.addGroup.descLabel)}
                  placeholder={t(
                    TRANSLATION_KEYS.modals.addGroup.descPlaceholder,
                  )}
                  {...register("description")}
                  className="focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  disabled={isLoading}
                  error={errors.description?.message}
                />
              </div>
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                onClick={handleClose}
                disabled={isLoading}
              >
                {t(TRANSLATION_KEYS.actions.cancel)}
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={isLoading}
              >
                {isLoading && <CircleNotch className="w-3.5 h-3.5 animate-spin" />}
                {isEditMode
                  ? t(TRANSLATION_KEYS.modals.addGroup.btnUpdate)
                  : t(TRANSLATION_KEYS.modals.addGroup.btnCreate)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
