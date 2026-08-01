import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { BuildingsIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";

import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextarea } from "@/components/ui/forms/form-textarea";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalScrollArea,
} from "@/components/ui/layout/modal";
import { TRANSLATION_KEYS } from "@/constants/translations";
import {
  useCreateDepartment,
  useUpdateDepartment,
} from "@/features/workspace-settings/hooks/use-departments";
import {
  DepartmentFormData,
  departmentSchema,
} from "@/features/workspace-settings/schema/department.schema";
import { Department } from "@/types/workspace.types";

export function AddNewDepartmentModal({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Department | null;
}) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.modals.addDepartment;
  const TK_EDIT = TRANSLATION_KEYS.modals.editDepartment;
  const ACT = TRANSLATION_KEYS.actions;

  const { mutate: createDepartment, isPending: isCreating } =
    useCreateDepartment();
  const { mutate: updateDepartment, isPending: isUpdating } =
    useUpdateDepartment();

  const isEditing = !!initialData;
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
        });
      } else {
        reset({
          name: "",
          description: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: DepartmentFormData) => {
    if (isEditing && initialData) {
      updateDepartment(
        { departmentId: initialData.id, data },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createDepartment(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={isEditing ? t(TK_EDIT.title) : t(TK.title)}
            icon={<BuildingsIcon className="w-5 h-5 text-blue-500" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={isEditing ? t(TK_EDIT.subtitle) : t(TK.subtitle)}
            >
              <div className="flex flex-col gap-5">
                <FormInput
                  label={t(TK.nameLabel)}
                  placeholder={t(TK.namePlaceholder)}
                  error={errors.name?.message}
                  required
                  {...register("name")}
                />

                <FormTextarea
                  label={t(TK.descLabel)}
                  placeholder={t(TK.descPlaceholder)}
                  error={errors.description?.message}
                  {...register("description")}
                />
              </div>
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Ghost}
                onClick={onClose}
              >
                {t(ACT.cancel)}
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={isPending}
              >
                {isPending && (
                  <CircleNotchIcon className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isEditing
                  ? isPending
                    ? t(ACT.saving)
                    : t(ACT.save)
                  : isPending
                    ? t(ACT.creating)
                    : t(TK.btn)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
