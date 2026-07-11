import { Briefcase, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

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
import {
  useCreateEmploymentType,
  useUpdateEmploymentType,
} from "@/features/employment-types/hooks/use-employment-types";
import { EmploymentType } from "@/types/workspace.types";
import { useTranslations } from "next-intl";
import {
  employmentTypeSchema,
  EmploymentTypeFormData,
} from "@/features/workspace-settings/schema/employment-type.schema";
import { TRANSLATION_KEYS } from "@/constants/translations";

export function AddNewEmploymentTypeModal({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: EmploymentType | null;
}) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.modals.addEmploymentType;
  const ACT = TRANSLATION_KEYS.actions;

  const { mutate: createEmploymentType, isPending: isCreating } =
    useCreateEmploymentType();
  const { mutate: updateEmploymentType, isPending: isUpdating } =
    useUpdateEmploymentType();

  const isEditing = !!initialData;
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmploymentTypeFormData>({
    resolver: zodResolver(employmentTypeSchema),
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

  const onSubmit = (data: EmploymentTypeFormData) => {
    if (isEditing && initialData) {
      updateEmploymentType(
        {
          employmentTypeId: initialData.id,
          data,
        },
        {
          onSuccess: () => onClose(),
        },
      );
    } else {
      createEmploymentType(data, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="max-w-md w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={
              isEditing ? t("modals.editEmploymentType.title") : t(TK.title)
            }
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={
                isEditing
                  ? t("modals.editEmploymentType.subtitle")
                  : t(TK.subtitle)
              }
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
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
