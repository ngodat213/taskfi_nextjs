import { FileText, Sparkle, CircleNotch } from "@phosphor-icons/react/dist/ssr";
;
import { useForm, Controller } from "react-hook-form";
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
import { FormSelect } from "@/components/ui/forms/form-select";
import { Textarea } from "@/components/ui/forms/textarea";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { useMemo, useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  useWorkspaceRoles,
  useInviteWorkspaceMember,
  useUpdateWorkspaceMember,
} from "@/features/workspaces/hooks/use-workspaces";
import { useTranslations } from "next-intl";
import {
  inviteUserSchema,
  InviteUserFormData,
} from "@/features/workspace-settings/schema/user.schema";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { useDepartments } from "@/features/workspace-settings/hooks/use-departments";
import { useEmploymentTypes } from "@/features/workspace-settings/hooks/use-employment-types";
import { Label } from "@/components/ui/forms/label";
import { WorkspaceMember } from "@/types/workspace.types";

interface AddNewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  memberToEdit?: WorkspaceMember | null;
}

export function AddNewUserModal({
  isOpen,
  onClose,
  mode = "add",
  memberToEdit,
}: AddNewUserModalProps) {
  const t = useTranslations("WorkspaceSettings");
  const TK = TRANSLATION_KEYS.modals.addUser;
  const ACT = TRANSLATION_KEYS.actions;

  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );

  const { data: rolesResponse } = useWorkspaceRoles(
    activeWorkspaceId as string,
  );
  const roles = useMemo(() => rolesResponse?.data?.data || [], [rolesResponse]);

  const { data: departmentsResponse, isLoading: isLoadingDepartments } =
    useDepartments();
  const departments = useMemo(
    () => departmentsResponse?.data || [],
    [departmentsResponse],
  );

  const { data: employmentTypesResponse, isLoading: isLoadingEmploymentTypes } =
    useEmploymentTypes();
  const employmentTypes = useMemo(
    () => employmentTypesResponse?.data || [],
    [employmentTypesResponse],
  );

  const inviteMutation = useInviteWorkspaceMember();
  const updateMutation = useUpdateWorkspaceMember();

  const isEditMode = mode === "edit";
  const isPending = inviteMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      roleId: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && memberToEdit) {
        reset({
          username: memberToEdit.username || "",
          email: memberToEdit.email || "",
          phone: memberToEdit.phone || "",
          location: memberToEdit.location || "",
          jobTitle: memberToEdit.jobTitle || "",
          roleId: memberToEdit.roleId || "",
          departmentId: memberToEdit.departmentId || undefined,
          employmentTypeId: memberToEdit.employmentTypeId || undefined,
          skills: memberToEdit.skills || "",
          personalNote: memberToEdit.personalNote || "",
        });
      } else {
        reset(() => ({
          username: "",
          email: "",
          phone: "",
          location: "",
          jobTitle: "",
          roleId: roles.length > 0 ? roles[0].id : "",
          departmentId: undefined,
          employmentTypeId: undefined,
          skills: "",
          personalNote: "",
        }));
      }
    } else {
      reset();
    }
  }, [isOpen, isEditMode, memberToEdit, roles, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: InviteUserFormData) => {
    if (!activeWorkspaceId) return;

    try {
      if (isEditMode && memberToEdit) {
        await updateMutation.mutateAsync({
          workspaceId: activeWorkspaceId,
          memberId: memberToEdit.userId,
          data: {
            ...data,
          },
        });
      } else {
        await inviteMutation.mutateAsync({
          workspaceId: activeWorkspaceId,
          data: {
            username: data.username,
            email: data.email,
            phone: data.phone,
            location: data.location,
            roleId: data.roleId,
            jobTitle: data.jobTitle,
            departmentId: data.departmentId,
            employmentTypeId: data.employmentTypeId,
            skills: data.skills,
            personalNote: data.personalNote,
          },
        });
      }
      handleClose();
    } catch (error) {
      console.error(error);
      const err = error as Error & {
        response?: { data?: { message?: string } };
      };
      const message =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred.";
      setError("root", { type: "server", message });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title={isEditMode ? "Edit Member" : t(TK.title)}
            icon={<FileText className="w-4 h-4" />}
          />
          <ModalBody>
            <ModalScrollArea
              title={isEditMode ? "Update Member Details" : t(TK.subtitle)}
              description={
                isEditMode ? "Modify member details below" : t(TK.desc)
              }
              errorMessage={errors.root?.message}
            >
              <div className="flex flex-col gap-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormInput
                    label={t(TK.fullNameLabel)}
                    required
                    type="text"
                    placeholder={t(TK.fullNamePlaceholder)}
                    {...register("username")}
                    disabled={inviteMutation.isPending}
                    error={errors.username?.message}
                  />
                  <FormInput
                    label={t(TK.emailLabel)}
                    required
                    type="email"
                    disabled={isEditMode || inviteMutation.isPending}
                    placeholder={t(TK.emailPlaceholder)}
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>

                {/* Row 2: Phone & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormInput
                    label={t(TK.phoneLabel) || "Phone Number"}
                    type="tel"
                    placeholder={t(TK.phonePlaceholder) || "Enter phone number"}
                    {...register("phone")}
                    disabled={inviteMutation.isPending}
                    error={errors.phone?.message}
                  />
                  <FormInput
                    label={t(TK.locationLabel) || "Location"}
                    type="text"
                    placeholder={t(TK.locationPlaceholder) || "Enter location"}
                    {...register("location")}
                    disabled={inviteMutation.isPending}
                    error={errors.location?.message}
                  />
                </div>

                {/* Row 3: Title & Department */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <FormInput
                    label={t(TK.jobTitleLabel)}
                    required
                    type="text"
                    placeholder={t(TK.jobTitlePlaceholder)}
                    {...register("jobTitle")}
                    disabled={inviteMutation.isPending}
                    error={errors.jobTitle?.message}
                  />
                  <Controller
                    name="departmentId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormSelect
                        label={t(TK.departmentLabel)}
                        disabled={
                          inviteMutation.isPending || isLoadingDepartments
                        }
                        error={fieldState.error?.message}
                        {...field}
                      >
                        <option value="" disabled>
                          {isLoadingDepartments
                            ? t(TK.loadingRoles)
                            : t(TK.departmentOptions.placeholder)}
                        </option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </FormSelect>
                    )}
                  />
                </div>

                {/* Row 4: Role & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <Controller
                    name="roleId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormSelect
                        label={t(TK.workspaceRoleLabel)}
                        required
                        disabled={inviteMutation.isPending}
                        error={fieldState.error?.message}
                        {...field}
                      >
                        {roles.length === 0 && (
                          <option value="" disabled>
                            {t(TK.loadingRoles)}
                          </option>
                        )}
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </FormSelect>
                    )}
                  />
                  <Controller
                    name="employmentTypeId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <FormSelect
                        label={t(TK.employmentTypeLabel)}
                        disabled={
                          inviteMutation.isPending || isLoadingEmploymentTypes
                        }
                        error={fieldState.error?.message}
                        {...field}
                      >
                        <option value="" disabled>
                          {isLoadingEmploymentTypes
                            ? t(TK.loadingRoles)
                            : t(TK.departmentOptions.placeholder)}
                        </option>
                        {employmentTypes.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                      </FormSelect>
                    )}
                  />
                </div>

                {/* Row 5: Skills/Tags */}
                <FormInput
                  label={t(TK.skillsLabel)}
                  type="text"
                  placeholder={t(TK.skillsPlaceholder)}
                  {...register("skills")}
                  disabled={inviteMutation.isPending}
                  error={errors.skills?.message}
                />

                {/* Row 6: Personal Note */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label>{t(TK.noteLabel)}</Label>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Sparkle className="w-3.5 h-3.5" />
                      {t(TK.generateAi)}
                    </button>
                  </div>
                  <Textarea
                    placeholder={t(TK.notePlaceholder)}
                    {...register("personalNote")}
                    disabled={inviteMutation.isPending}
                  />
                </div>
              </div>
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Outline}
                onClick={handleClose}
                disabled={isPending}
              >
                {t(ACT.cancel)}
              </Button>
              <Button
                type="submit"
                variant={ButtonVariant.Primary}
                disabled={isPending}
              >
                {isPending && <CircleNotch className="w-3.5 h-3.5 animate-spin" />}
                {isEditMode ? "Save Changes" : t(TK.btn)}
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
