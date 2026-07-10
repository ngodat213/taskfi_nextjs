import { useState } from "react";
import Image from "next/image";
import { Plus, Briefcase, Loader2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

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
          <ModalScrollArea>
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <h2 className="text-[18px] font-semibold text-slate-900 tracking-tight">
                  Workspace details
                </h2>
              </div>
              <p className="text-[13.5px] text-slate-500 mt-1.5">
                Create a new workspace for your team.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex justify-center mb-2">
                <div className="relative w-[72px] h-[72px] rounded-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all cursor-pointer group overflow-hidden shadow-sm">
                  {logoPreview ? (
                    <>
                      <Image
                        src={logoPreview}
                        alt="Workspace logo"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <span className="text-white text-[11px] font-medium">
                          Change
                        </span>
                      </div>
                    </>
                  ) : (
                    <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>
                  Workspace name <span className="text-red-500">*</span>
                </Label>
                <Input
                  autoFocus
                  type="text"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  placeholder="e.g. Design new landing page"
                  className="h-9 text-[13px] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Description</Label>
                <Textarea
                  value={newWorkspaceDesc}
                  onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                  placeholder="Briefly describe what this workspace is for..."
                  className="min-h-[80px] resize-y text-[13px] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 transition-all"
                />
              </div>
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
