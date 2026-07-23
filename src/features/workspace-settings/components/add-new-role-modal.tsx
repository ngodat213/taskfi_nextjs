import { Shield, Sparkle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { useEffect } from "react";
;
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { FormInput } from "@/components/ui/forms/form-input";
import { Label } from "@/components/ui/forms/label";
import { Select } from "@/components/ui/forms/select";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { Textarea } from "@/components/ui/forms/textarea";
import { useTranslations } from "next-intl";
import { PermissionMatrixTable } from "./permission-matrix-table";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateWorkspaceRole,
  useUpdateWorkspaceRole,
} from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { WorkspaceRole } from "@/types/workspace.types";
import {
  createRoleSchema,
  CreateRoleFormData,
} from "@/features/workspace-settings/schema/role.schema";
import { TRANSLATION_KEYS } from "@/constants/translations";

interface AddNewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: WorkspaceRole | null;
}

export function AddNewRoleModal({
  isOpen,
  onClose,
  initialData,
}: AddNewRoleModalProps) {
  const t = useTranslations("WorkspaceSettings");
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const createRoleMutation = useCreateWorkspaceRole();
  const updateRoleMutation = useUpdateWorkspaceRole();

  const isEditMode = !!initialData;
  const isPending =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          description: initialData.description || "",
          permissions: initialData.permissions,
        });
      } else {
        reset({
          name: "",
          description: "",
          permissions: [],
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const permissions = useWatch({ control, name: "permissions" }) || [];

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateRoleFormData) => {
    if (!activeWorkspaceId) return;

    if (isEditMode && initialData) {
      updateRoleMutation.mutate(
        {
          workspaceId: activeWorkspaceId,
          roleId: initialData.id,
          data: {
            ...data,
          },
        },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    } else {
      createRoleMutation.mutate(
        {
          workspaceId: activeWorkspaceId,
          data: {
            ...data,
            scope: "workspace",
          },
        },
        {
          onSuccess: () => {
            handleClose();
          },
        },
      );
    }
  };

  const fieldStyle = "h-10 focus:border-blue-500 focus:ring-blue-500";

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[800px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={
              isEditMode
                ? t(TRANSLATION_KEYS.modals.editRole.title)
                : t(TRANSLATION_KEYS.modals.addRole.title)
            }
            icon={<Shield className="w-4 h-4" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={
                isEditMode
                  ? t(TRANSLATION_KEYS.modals.editRole.subtitle)
                  : t(TRANSLATION_KEYS.modals.addRole.subtitle)
              }
              description={t(TRANSLATION_KEYS.modals.addRole.desc)}
            >
              <div className="flex flex-col gap-5">
                <FormInput
                  label={t(TRANSLATION_KEYS.modals.addRole.nameLabel)}
                  required
                  type="text"
                  {...register("name")}
                  placeholder={t(
                    TRANSLATION_KEYS.modals.addRole.namePlaceholder,
                  )}
                  className={fieldStyle}
                  error={errors.name?.message}
                />

                <div className="flex flex-col gap-1.5">
                  <Label>
                    {t(TRANSLATION_KEYS.modals.addRole.baseRoleLabel)}
                  </Label>
                  <Select className={fieldStyle} defaultValue="member">
                    <option value="admin">
                      {t(TRANSLATION_KEYS.modals.addRole.baseRoleOptions.admin)}
                    </option>
                    <option value="member">
                      {t(
                        TRANSLATION_KEYS.modals.addRole.baseRoleOptions.member,
                      )}
                    </option>
                    <option value="viewer">
                      {t(
                        TRANSLATION_KEYS.modals.addRole.baseRoleOptions.viewer,
                      )}
                    </option>
                    <option value="none">
                      {t(TRANSLATION_KEYS.modals.addRole.baseRoleOptions.none)}
                    </option>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label>
                      {t(TRANSLATION_KEYS.modals.addRole.descLabel)}
                    </Label>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Sparkle className="w-3.5 h-3.5" />
                      {t(TRANSLATION_KEYS.modals.addRole.generateAi)}
                    </button>
                  </div>
                  <Textarea
                    {...register("description")}
                    placeholder={t(
                      TRANSLATION_KEYS.modals.addRole.descPlaceholder,
                    )}
                    className="focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-4 mt-2">
                  <Label>
                    {t(TRANSLATION_KEYS.modals.addRole.matrixTitle)}
                  </Label>
                  <PermissionMatrixTable
                    permissions={permissions}
                    onChange={(val) => setValue("permissions", val)}
                  />
                </div>
              </div>
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Ghost}
                onClick={handleClose}
                disabled={isPending}
              >
                {t(TRANSLATION_KEYS.actions.cancel)}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <CircleNotch className="w-3.5 h-3.5 animate-spin" />}
                {isEditMode
                  ? t(TRANSLATION_KEYS.actions.save)
                  : t(TRANSLATION_KEYS.modals.addRole.btn)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
