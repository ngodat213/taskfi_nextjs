import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleNotchIcon,
  FolderOpenIcon,
} from "@phosphor-icons/react/dist/ssr";

import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextarea } from "@/components/ui/forms/form-textarea";
import { LogoPicker } from "@/components/ui/forms/logo-picker";
import { Select } from "@/components/ui/forms/select";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalScrollArea,
} from "@/components/ui/layout/modal";
import { APP_CONFIG } from "@/config/app.config";
import { TRANSLATION_KEYS } from "@/constants/translations";
import {
  useCreateProject,
  useUpdateProject,
} from "@/features/projects/hooks/use-projects";
import {
  CreateProjectFormData,
  createProjectSchema,
} from "@/features/projects/schema/project.schema";
import { useGroups } from "@/features/workspace-settings/hooks/use-groups";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { uploadService } from "@/services/upload.service";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Project } from "@/types/project.types";

export function AddNewProjectModal({
  isOpen,
  onClose,
  projectToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}) {
  const t = useTranslations("Projects");
  const TK = TRANSLATION_KEYS.PROJECTS.addProject;
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: membersData, isLoading: isLoadingMembers } =
    useWorkspaceMembers(activeWorkspaceId as string, {
      page: 1,
      limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
    });
  const members = membersData?.data?.data || [];

  const { data: groupsResponse, isLoading: isLoadingGroups } = useGroups({
    limit: APP_CONFIG.PAGINATION.MAX_LIMIT,
  });
  const groups = groupsResponse?.data?.data || [];

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();
  const isLoading = isCreating || isUpdating || isUploading;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      key: "",
      name: "",
      projectType: "SOFTWARE",
      description: "",
      logoPublicId: "",
      leadId: "",
      groupId: "",
    },
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevProjectToEditId, setPrevProjectToEditId] = useState(
    projectToEdit?.id,
  );

  if (isOpen !== prevIsOpen || projectToEdit?.id !== prevProjectToEditId) {
    setPrevIsOpen(isOpen);
    setPrevProjectToEditId(projectToEdit?.id);

    if (isOpen) {
      if (projectToEdit) {
        const initialPreview =
          projectToEdit.logo?.fileUrl ||
          projectToEdit.logoUrl ||
          (projectToEdit.logoPublicId?.startsWith("http")
            ? projectToEdit.logoPublicId
            : "");

        reset({
          key: projectToEdit.key || "",
          name: projectToEdit.name || "",
          projectType: projectToEdit.projectType || "SOFTWARE",
          description: projectToEdit.description || "",
          logoPublicId:
            projectToEdit.logo?.publicId ||
            projectToEdit.logoPublicId ||
            projectToEdit.logoUrl ||
            "",
          leadId: projectToEdit.leadId || "",
          groupId: projectToEdit.groupId || "",
        });
        setLogoPreview(initialPreview);
        setLogoFile(null);
      } else {
        reset({
          key: "",
          name: "",
          projectType: "SOFTWARE",
          description: "",
          logoPublicId: "",
          leadId: "",
          groupId: "",
        });
        setLogoFile(null);
        setLogoPreview("");
      }
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      reset();
      setLogoFile(null);
      if (logoPreview && logoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreview);
      }
      setLogoPreview("");
      onClose();
    }
  };

  const onSubmit = async (data: CreateProjectFormData) => {
    let finalLogoPublicId = projectToEdit?.logoPublicId || data.logoPublicId;

    if (logoFile) {
      try {
        setIsUploading(true);
        const uploadRes = await uploadService.uploadImage(logoFile);
        if (uploadRes.success && uploadRes.data) {
          finalLogoPublicId = uploadRes.data.url || uploadRes.data.publicId;
        }
      } catch (err) {
        console.error("Failed to upload logo:", err);
      } finally {
        setIsUploading(false);
      }
    }

    const { groupId, ...payload } = data;
    const finalPayload = {
      ...payload,
      logoPublicId: finalLogoPublicId,
    };

    const handleSuccess = () => {
      handleClose();
    };

    const handleError = (error: unknown) => {
      const err = error as Error & {
        response?: { data?: { message?: string | string[] } };
      };
      console.error("Failed to save project:", err);
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setError("root", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    };

    if (projectToEdit) {
      updateProject(
        { projectId: projectToEdit.id, data: finalPayload },
        { onSuccess: handleSuccess, onError: handleError },
      );
    } else {
      createProject(
        { groupId, data: finalPayload },
        { onSuccess: handleSuccess, onError: handleError },
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[650px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={projectToEdit ? "Chỉnh sửa dự án" : t(TK.title)}
            icon={<FolderOpenIcon className="w-4 h-4" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={t(TK.detailsTitle)}
              description={t(TK.subtitle)}
              errorMessage={errors.root?.message}
            >
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 flex flex-col items-center justify-center pt-2 pb-2">
                  <LogoPicker
                    previewUrl={logoPreview}
                    changeLabel={t(TK.changeLogo)}
                    onChange={(file) => {
                      setLogoFile(file);
                      setLogoPreview(URL.createObjectURL(file));
                    }}
                  />
                  <span className="text-xs text-muted-foreground font-medium mt-1">
                    {t(TK.logoLabel)}
                  </span>
                </div>

                <FormInput
                  label={t(TK.nameLabel)}
                  required
                  {...register("name")}
                  placeholder={t(TK.namePlaceholder)}
                  error={errors.name?.message}
                />

                <FormInput
                  label={t(TK.keyLabel)}
                  required
                  {...register("key")}
                  placeholder={t(TK.keyPlaceholder)}
                  error={errors.key?.message}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-foreground">
                    {t(TK.typeLabel)}
                  </label>
                  <Controller
                    control={control}
                    name="projectType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        className="h-10 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="SOFTWARE">
                          {t(TK.typeOptions.software)}
                        </option>
                        <option value="BUSINESS">
                          {t(TK.typeOptions.business)}
                        </option>
                        <option value="MARKETING">
                          {t(TK.typeOptions.marketing)}
                        </option>
                        <option value="KANBAN">
                          {t(TK.typeOptions.kanban)}
                        </option>
                      </Select>
                    )}
                  />
                  {errors.projectType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-foreground">
                    {t(TK.groupLabel)}
                  </label>
                  <Controller
                    control={control}
                    name="groupId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoadingGroups}
                        className="h-10 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">{t(TK.groupPlaceholder)}</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.groupId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.groupId.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-foreground">
                    {t(TK.leadLabel)}
                  </label>
                  <Controller
                    control={control}
                    name="leadId"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoadingMembers}
                        className="h-10 focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">{t(TK.leadPlaceholder)}</option>
                        {members.map((m) => (
                          <option key={m.userId} value={m.userId}>
                            {`${m.username} (${m.email})`}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.leadId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.leadId.message}
                    </p>
                  )}
                </div>

                <FormTextarea
                  containerClassName="col-span-2"
                  label={t(TK.descLabel)}
                  {...register("description")}
                  placeholder={t(TK.descPlaceholder)}
                  error={errors.description?.message}
                />
              </div>
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Ghost}
                onClick={handleClose}
                disabled={isLoading}
              >
                {t(TK.cancel)}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <CircleNotchIcon className="w-3.5 h-3.5 animate-spin" />
                )}
                {t(TK.submit)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
