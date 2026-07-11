import { CheckSquare, UploadCloud } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { InputLabel } from "@/components/ui/forms/input-label";
import { Select } from "@/components/ui/forms/select";
import { Textarea } from "@/components/ui/forms/textarea";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-[900px]">
        <ModalHeader
          title="Create new task"
          icon={<CheckSquare className="w-4 h-4" />}
        />
        <ModalBody>
          <ModalScrollArea
            title="Task details"
            description="Create a new task and assign it to a project and team member."
          >
            <AddTaskForm />
          </ModalScrollArea>

          <ModalFooter>
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-slate-50 border border-transparent rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-medium rounded-lg shadow-sm transition-all">
              Create Task
            </button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AddTaskForm() {
  const fieldStyle =
    "h-9 text-[13px] focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15";

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column: Main Content */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <InputLabel required>Task name</InputLabel>
          <Input
            type="text"
            placeholder="e.g. Design new landing page"
            className={fieldStyle}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Description</Label>
          <Textarea
            placeholder="Add any details or requirements for this task..."
            className="min-h-[160px] resize-y text-[13px] focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Attachments</Label>
          <div className="flex justify-center px-6 py-8 border-2 border-slate-200 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group">
            <div className="space-y-2 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <UploadCloud className="h-5 w-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex text-[13px] text-slate-600 justify-center">
                <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none">
                  <span>Click to upload</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                  />
                </span>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-[12px] text-slate-500">
                SVG, PNG, JPG or PDF (max. 10MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Metadata / Settings */}
      <div className="w-full md:w-[320px] flex flex-col gap-5 h-fit">
        <div className="flex flex-col gap-1.5">
          <Label>Project</Label>
          <Select className={fieldStyle}>
            <option value="">Select project...</option>
            <option value="1">MEBIECO - Web App</option>
            <option value="2">TaskFi - Mobile</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Parent task</Label>
          <Select className={fieldStyle}>
            <option value="">None (Top level)</option>
            <option value="tsk-01">TSK-01: Design new landing page</option>
            <option value="tsk-02">TSK-02: Fix navigation bug</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Assignee</Label>
          <Select className={fieldStyle}>
            <option value="">Unassigned</option>
            <option value="1">Dat Ngo</option>
            <option value="2">John Doe</option>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Task type</Label>
            <Select className={fieldStyle}>
              <option value="task">Task</option>
              <option value="subtask">Subtask</option>
              <option value="bug">Bug</option>
              <option value="epic">Epic</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select className={fieldStyle}>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="done">Done</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Priority</Label>
            <Select className={fieldStyle}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Story points</Label>
            <Input
              type="number"
              min="0"
              step="0.5"
              placeholder="e.g. 3"
              className={fieldStyle}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Due date</Label>
          <Input type="date" className={fieldStyle} />
        </div>
      </div>
    </div>
  );
}
