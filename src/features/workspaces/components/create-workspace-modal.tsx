import { useState } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { LogoPicker } from "@/components/ui/forms/logo-picker";
import { FormInput } from "@/components/ui/forms/form-input";
import { FormTextarea } from "@/components/ui/forms/form-textarea";
import { useCreateWorkspace } from "@/features/workspaces/hooks/use-workspaces";
import { uploadService } from "@/services/upload.service";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWorkspaceModal({
  isOpen,
  onClose,
}: CreateWorkspaceModalProps) {
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createWorkspace, isPending: isCreating } =
    useCreateWorkspace();

  const handleRemoveLogo = () => {
    setLogoFile(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview("");
    }
  };

  const handleClose = () => {
    if (!isCreating && !isUploading) {
      onClose();
    }
  };

  const handleCreate = async () => {
    if (!newWorkspaceName.trim()) return;

    let uploadedLogoUrl: string | undefined = undefined;

    if (logoFile) {
      try {
        setIsUploading(true);
        const uploadRes = await uploadService.uploadImage(logoFile);
        if (uploadRes.success && uploadRes.data?.url) {
          uploadedLogoUrl = uploadRes.data.url;
        }
      } catch (error) {
        console.error("Failed to upload logo:", error);
      } finally {
        setIsUploading(false);
      }
    }

    createWorkspace(
      {
        name: newWorkspaceName.trim(),
        description: newWorkspaceDesc.trim() || undefined,
        logoUrl: uploadedLogoUrl,
      },
      {
        onSuccess: () => {
          onClose();
          setNewWorkspaceName("");
          setNewWorkspaceDesc("");
          handleRemoveLogo();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalContent maxWidth="max-w-[400px]">
        <ModalHeader
          title="Create Workspace"
          icon={<Briefcase className="w-4 h-4" />}
        />
        <ModalBody>
          <ModalScrollArea
            title="Workspace details"
            description="Create a new workspace for your team."
          >
            <div className="flex flex-col gap-5">
              <LogoPicker
                previewUrl={logoPreview}
                changeLabel="Change"
                onChange={(file) => {
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                }}
              />

              <FormInput
                label="Workspace name"
                required
                autoFocus
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g. Design new landing page"
                className="h-9 text-[13px] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 transition-all"
              />

              <FormTextarea
                label="Description"
                value={newWorkspaceDesc}
                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                placeholder="Briefly describe what this workspace is for..."
                className="min-h-[80px] resize-y text-[13px] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 transition-all"
              />
            </div>
          </ModalScrollArea>

          <ModalFooter>
            <button
              onClick={handleClose}
              disabled={isCreating}
              className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={isCreating || isUploading || !newWorkspaceName.trim()}
              className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-medium rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {(isCreating || isUploading) && (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              )}
              Create Workspace
            </button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
