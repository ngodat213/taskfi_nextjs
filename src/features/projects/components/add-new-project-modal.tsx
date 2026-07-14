import { FolderOpen, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

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
import { Select } from "@/components/ui/forms/select";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { useTranslations } from "next-intl";
import {
  createProjectSchema,
  CreateProjectFormData,
} from "@/features/projects/schema/project.schema";
import { useCreateProject } from "@/features/projects/hooks/use-projects";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspaces";
import { useGroups } from "@/features/groups/hooks/use-groups";
import { useWorkspaceStore } from "@/store/workspace.store";
import { LogoPicker } from "@/components/ui/forms/logo-picker";
import { uploadService } from "@/services/upload.service";
import { APP_CONFIG } from "@/config/app.config";
import { TRANSLATION_KEYS } from "@/constants/translations";

export function AddNewProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
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

  const { data: groupsResponse, isLoading: isLoadingGroups } = useGroups();
  const groups = Array.isArray(groupsResponse?.data) ? groupsResponse.data : [];

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createProject, isPending: isCreating } = useCreateProject();
  const isLoading = isCreating || isUploading;

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
      logoUrl: "",
      leadId: "",
      groupId: "",
    },
  });

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      reset({
        key: "",
        name: "",
        projectType: "SOFTWARE",
        description: "",
        logoUrl: "",
        leadId: "",
        groupId: "",
      });
      setLogoFile(null);
      setLogoPreview("");
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
    let finalLogoUrl = data.logoUrl;
    if (logoFile) {
      try {
        setIsUploading(true);
        const uploadRes = await uploadService.uploadImage(logoFile);
        if (uploadRes.success && uploadRes.data?.url) {
          finalLogoUrl = uploadRes.data.url;
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
      logoUrl: finalLogoUrl,
    };

    createProject(
      { groupId, data: finalPayload },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (error: unknown) => {
          const err = error as Error & {
            response?: { data?: { message?: string | string[] } };
          };
          console.error("Failed to create project:", err);
          const message =
            err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred.";
          setError("root", {
            type: "server",
            message: Array.isArray(message) ? message[0] : message,
          });
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[650px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={t(TK.title)}
            icon={<FolderOpen className="w-4 h-4" />}
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
                  <span className="text-xs text-slate-500 font-medium mt-1">
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
                  <label className="text-[13px] font-medium text-slate-700">
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
                  <label className="text-[13px] font-medium text-slate-700">
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
                  <label className="text-[13px] font-medium text-slate-700">
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
                {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {t(TK.submit)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
