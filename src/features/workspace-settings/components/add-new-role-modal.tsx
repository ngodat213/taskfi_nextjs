import { Shield, Sparkles } from "lucide-react";
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
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddNewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddNewRoleModal({ isOpen, onClose }: AddNewRoleModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-[600px]">
        <ModalHeader
          title="Create new role"
          icon={<Shield className="w-4 h-4" />}
        />
        <ModalBody>
          <ModalScrollArea>
            <div className="mb-6">
              <h2 className="text-[18px] font-semibold text-slate-900 tracking-tight">
                New Custom Role
              </h2>
              <p className="text-[13.5px] text-slate-500 mt-1.5">
                Define a custom role with specific permissions to fit your
                workspace needs.
              </p>
            </div>

            <AddNewRoleForm />
          </ModalScrollArea>

          <ModalFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-medium rounded-lg shadow-sm transition-all">
              Create Role
            </button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AddNewRoleForm() {
  const fieldStyle = "h-10 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label>
          Role name <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          placeholder="e.g. Project Manager"
          className={fieldStyle}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Base role to copy permissions from</Label>
        <Select className={fieldStyle} defaultValue="member">
          <option value="admin">Workspace Admin (Full access)</option>
          <option value="member">Member (Standard access)</option>
          <option value="viewer">Viewer (Read-only)</option>
          <option value="none">None (Start from scratch)</option>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Description</Label>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <Textarea
          placeholder="Briefly describe what users with this role can do..."
          className="focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
