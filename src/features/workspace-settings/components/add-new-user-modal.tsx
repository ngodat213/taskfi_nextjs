import { FileText, Sparkles } from "lucide-react";
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

interface AddNewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddNewUserModal({ isOpen, onClose }: AddNewUserModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-[600px]">
        <ModalHeader
          title="Add new member"
          icon={<FileText className="w-4 h-4" />}
        />
        <ModalBody>
          <ModalScrollArea>
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <h2 className="text-[18px] font-semibold text-slate-900 tracking-tight">
                  Invite team member
                </h2>
                <span className="text-[12px] text-slate-500 font-medium pt-1">
                  Step 1 of 1
                </span>
              </div>
              <p className="text-[13.5px] text-slate-500 mt-1.5">
                Fill in the employee details. They will receive an email
                invitation to join the workspace.
              </p>
            </div>

            <AddNewUserForm />
          </ModalScrollArea>

          <ModalFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-medium rounded-lg shadow-sm transition-all">
              Send Invite
            </button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AddNewUserForm() {
  const fieldStyle = "h-10 focus:border-blue-500 focus:ring-blue-500";

  return (
    <div className="flex flex-col gap-5">
      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Full name</Label>
          <Input
            type="text"
            placeholder="e.g. Dat Ngo"
            className={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>
            Email address <span className="text-red-500">*</span>
          </Label>
          <Input
            type="email"
            placeholder="colleague@taskfi.com"
            className={fieldStyle}
          />
        </div>
      </div>

      {/* Row 2: Title & Department */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Job title</Label>
          <Input
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            className={fieldStyle}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Department</Label>
          <Select className={fieldStyle} defaultValue="">
            <option value="" disabled>
              Select department
            </option>
            <option value="engineering">Engineering</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="product">Product</option>
            <option value="sales">Sales</option>
          </Select>
        </div>
      </div>

      {/* Row 3: Role & Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <div className="flex flex-col gap-1.5">
          <Label>Workspace Role</Label>
          <Select className={fieldStyle} defaultValue="member">
            <option value="admin">Workspace Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Employment Type</Label>
          <Select className={fieldStyle} defaultValue="full-time">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contractor">Contractor</option>
          </Select>
        </div>
      </div>

      {/* Row 4: Skills/Tags */}
      <div className="flex flex-col gap-1.5">
        <Label>Skills / Tags (comma separated)</Label>
        <Input
          type="text"
          placeholder="e.g. React, Node.js, Figma"
          className={fieldStyle}
        />
      </div>

      {/* Row 5: Personal Note */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label>Personal note (optional)</Label>
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-blue-600 hover:text-blue-700 transition-colors">
            <Sparkles className="w-3.5 h-3.5" />
            Generate with AI
          </button>
        </div>
        <Textarea
          placeholder="Brief summary of what this invitation is for..."
          className="focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
