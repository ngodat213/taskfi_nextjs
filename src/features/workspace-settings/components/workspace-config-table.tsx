"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CircleNotchIcon,
  PlusIcon,
  TrashIcon,
  PencilSimpleIcon,
  FloppyDiskIcon,
  SlidersHorizontalIcon,
  TagIcon,
  CheckCircleIcon,
  DotsSixVerticalIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";
import {
  useWorkspaceConfig,
  useUpdateWorkspaceConfig,
} from "@/features/workspaces/hooks/use-workspaces";
import { useWorkspaceStore } from "@/store/workspace.store";
import { TableActionBtn } from "@/components/ui/data-display/table-action-btn";
import { WorkspaceStatus, WorkspaceIssueType } from "@/types/workspace.types";
import {
  StatusBadge,
  TypeIcon,
} from "@/features/dashboard/components/issue-table-row";
import { TypeBadge } from "@/components/ui/data-display/type-badge";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Input } from "@/components/ui/forms/input";
import { InputLabel } from "@/components/ui/forms/input-label";
import { Select } from "@/components/ui/forms/select";
import { EmptyState } from "@/components/ui/data-display/empty-state";
import { useAutoError } from "@/hooks/use-auto-error";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import {
  STAGGER_CONTAINER_VARIANTS,
  SPRING_CARD_VARIANTS,
} from "@/constants/animations";

// Sortable Row for Statuses
function SortableStatusRow({
  status,
  idx,
  onEdit,
  onDelete,
}: {
  status: WorkspaceStatus;
  idx: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: status.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "bg-muted/60" : ""}`}
    >
      <TableCell className="w-10 px-3 text-muted-foreground hover:text-foreground">
        <div
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted inline-flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <DotsSixVerticalIcon className="w-4 h-4" />
        </div>
      </TableCell>
      <TableCell className="w-12 px-2 font-semibold text-[12px] text-muted-foreground">
        {status.no ?? idx + 1}
      </TableCell>
      <TableCell className="font-medium text-[13px] text-foreground">
        {status.name}
      </TableCell>
      <TableCell>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted uppercase tracking-wider text-muted-foreground">
          {status.category}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
            style={{
              backgroundColor: status.color || "#6B7280",
            }}
          />
          <span className="text-[12px] font-mono text-muted-foreground">
            {status.color || "#6B7280"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={status.name} />
      </TableCell>
      <TableCell className="text-right pr-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TableActionBtn onClick={onEdit}>
            <PencilSimpleIcon className="w-3.5 h-3.5" />
          </TableActionBtn>
          <TableActionBtn onClick={onDelete}>
            <TrashIcon className="w-3.5 h-3.5 text-destructive" />
          </TableActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Sortable Row for Issue Types
function SortableTypeRow({
  type,
  idx,
  onEdit,
  onDelete,
}: {
  type: WorkspaceIssueType;
  idx: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: type.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "bg-muted/60" : ""}`}
    >
      <TableCell className="w-10 px-3 text-muted-foreground hover:text-foreground">
        <div
          {...attributes}
          {...listeners}
          className="p-1 rounded hover:bg-muted inline-flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <DotsSixVerticalIcon className="w-4 h-4" />
        </div>
      </TableCell>
      <TableCell className="w-12 px-2 font-semibold text-[12px] text-muted-foreground">
        {type.no ?? idx + 1}
      </TableCell>
      <TableCell className="font-medium text-[13px] text-foreground">
        <div className="flex items-center gap-2">
          <TypeIcon type={type.name} className="w-4 h-4" />
          <span>{type.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-[12px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {type.icon || "default"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
            style={{
              backgroundColor: type.color || "#3b82f6",
            }}
          />
          <span className="text-[12px] font-mono text-muted-foreground">
            {type.color || "#3b82f6"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-[12px] text-muted-foreground">
          {type.description || "—"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1 items-center">
          {!type.allowedParentTypes || type.allowedParentTypes.length === 0 ? (
            <span className="text-[11px] text-muted-foreground italic">
              None (Top Level)
            </span>
          ) : (
            type.allowedParentTypes.map((pt) => (
              <span
                key={pt}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-muted text-foreground px-2 py-0.5 rounded border border-border/50"
              >
                <TypeIcon type={pt} className="w-3 h-3 shrink-0" />
                {pt}
              </span>
            ))
          )}
        </div>
      </TableCell>
      <TableCell>
        <TypeBadge type={type.name} color={type.color} />
      </TableCell>
      <TableCell className="text-right pr-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <TableActionBtn onClick={onEdit}>
            <PencilSimpleIcon className="w-3.5 h-3.5" />
          </TableActionBtn>
          <TableActionBtn onClick={onDelete}>
            <TrashIcon className="w-3.5 h-3.5 text-destructive" />
          </TableActionBtn>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function WorkspaceConfigTable() {
  const activeWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: configResponse, isLoading } = useWorkspaceConfig(
    activeWorkspaceId as string,
  );
  const updateConfigMutation = useUpdateWorkspaceConfig();
  const { fieldErrors, handleApiError } = useAutoError();

  const [customStatuses, setCustomStatuses] = useState<
    WorkspaceStatus[] | null
  >(null);
  const [customIssueTypes, setCustomIssueTypes] = useState<
    WorkspaceIssueType[] | null
  >(null);
  const [isSaved, setIsSaved] = useState(false);

  const statuses = customStatuses ?? configResponse?.data?.statuses ?? [];
  const issueTypes = customIssueTypes ?? configResponse?.data?.issueTypes ?? [];

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingStatusIndex, setEditingStatusIndex] = useState<number | null>(
    null,
  );
  const [statusForm, setStatusForm] = useState<WorkspaceStatus>({
    name: "",
    category: "TODO",
    color: "#6B7280",
  });

  // Issue Type Modal State
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingTypeIndex, setEditingTypeIndex] = useState<number | null>(null);
  const [typeForm, setTypeForm] = useState<WorkspaceIssueType>({
    name: "",
    icon: "task",
    description: "",
    allowedParentTypes: [],
  });

  const handleSaveAll = () => {
    if (!activeWorkspaceId) return;

    updateConfigMutation.mutate(
      {
        workspaceId: activeWorkspaceId,
        data: { statuses, issueTypes },
      },
      {
        onSuccess: () => {
          setIsSaved(true);
          setCustomStatuses(null);
          setCustomIssueTypes(null);
          setTimeout(() => setIsSaved(false), 3000);
        },
        onError: (err) => {
          handleApiError(err);
        },
      },
    );
  };

  // Drag End Handlers
  const handleStatusDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = statuses.findIndex((s) => s.name === active.id);
      const newIndex = statuses.findIndex((s) => s.name === over.id);
      const newStatuses = arrayMove(statuses, oldIndex, newIndex).map(
        (s, idx) => ({ ...s, no: idx + 1 }),
      );
      setCustomStatuses(newStatuses);
    }
  };

  const handleTypeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = issueTypes.findIndex((t) => t.name === active.id);
      const newIndex = issueTypes.findIndex((t) => t.name === over.id);
      const newTypes = arrayMove(issueTypes, oldIndex, newIndex).map(
        (t, idx) => ({ ...t, no: idx + 1 }),
      );
      setCustomIssueTypes(newTypes);
    }
  };

  // Status handlers
  const handleOpenAddStatus = () => {
    setEditingStatusIndex(null);
    setStatusForm({
      no: statuses.length + 1,
      name: "",
      category: "TODO",
      color: "#6B7280",
    });
    setIsStatusModalOpen(true);
  };

  const handleOpenEditStatus = (index: number) => {
    setEditingStatusIndex(index);
    setStatusForm({ ...statuses[index] });
    setIsStatusModalOpen(true);
  };

  const handleDeleteStatus = (index: number) => {
    setCustomStatuses((prev) => {
      const current = prev ?? configResponse?.data?.statuses ?? [];
      const updated = current.filter((_, i) => i !== index);
      return updated.map((s, idx) => ({ ...s, no: idx + 1 }));
    });
  };

  const handleSaveStatus = () => {
    if (!statusForm.name.trim()) return;
    setCustomStatuses((prev) => {
      const current = prev ?? configResponse?.data?.statuses ?? [];
      let updated: WorkspaceStatus[];
      if (editingStatusIndex !== null) {
        updated = current.map((s, i) =>
          i === editingStatusIndex ? statusForm : s,
        );
      } else {
        updated = [...current, statusForm];
      }
      return updated.map((s, idx) => ({ ...s, no: s.no ?? idx + 1 }));
    });
    setIsStatusModalOpen(false);
  };

  // Issue Type handlers
  const handleOpenAddType = () => {
    setEditingTypeIndex(null);
    setTypeForm({
      no: issueTypes.length + 1,
      name: "",
      color: "#3b82f6",
      icon: "task",
      description: "",
      allowedParentTypes: [],
    });
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (index: number) => {
    setEditingTypeIndex(index);
    setTypeForm({
      allowedParentTypes: [],
      ...issueTypes[index],
    });
    setIsTypeModalOpen(true);
  };

  const handleDeleteType = (index: number) => {
    setCustomIssueTypes((prev) => {
      const current = prev ?? configResponse?.data?.issueTypes ?? [];
      const updated = current.filter((_, i) => i !== index);
      return updated.map((t, idx) => ({ ...t, no: idx + 1 }));
    });
  };

  const handleSaveType = () => {
    if (!typeForm.name.trim()) return;
    setCustomIssueTypes((prev) => {
      const current = prev ?? configResponse?.data?.issueTypes ?? [];
      let updated: WorkspaceIssueType[];
      if (editingTypeIndex !== null) {
        updated = current.map((t, i) =>
          i === editingTypeIndex ? typeForm : t,
        );
      } else {
        updated = [...current, typeForm];
      }
      return updated.map((t, idx) => ({ ...t, no: t.no ?? idx + 1 }));
    });
    setIsTypeModalOpen(false);
  };

  const handleToggleParentType = (targetTypeName: string) => {
    setTypeForm((prev) => {
      const current = prev.allowedParentTypes || [];
      const targetLower = targetTypeName.toLowerCase();
      const exists = current.some((p) => p.toLowerCase() === targetLower);
      const updated = exists
        ? current.filter((p) => p.toLowerCase() !== targetLower)
        : [...current, targetTypeName];
      return { ...prev, allowedParentTypes: updated };
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full bg-transparent flex items-center justify-center min-h-75">
        <CircleNotchIcon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      variants={STAGGER_CONTAINER_VARIANTS}
      initial="hidden"
      animate="show"
      className="flex-1 w-full bg-transparent"
    >
      <div className="w-full">
        {/* Top Header Block */}
        <motion.div
          variants={SPRING_CARD_VARIANTS}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-[18px] font-bold text-foreground tracking-tight">
              Workspace Configuration
            </h2>
            <p className="text-[13px] text-muted-foreground mt-1">
              Configure dynamic issue types and statuses for this workspace.
              Drag to reorder.
            </p>
          </div>

          <div className="flex items-center gap-3 relative">
            <Button
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              onClick={handleSaveAll}
              disabled={updateConfigMutation.isPending}
              className="flex items-center gap-1.5"
            >
              {updateConfigMutation.isPending ? (
                <CircleNotchIcon className="w-4 h-4 animate-spin" />
              ) : isSaved ? (
                <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
              ) : (
                <FloppyDiskIcon className="w-4 h-4" />
              )}
              <span>{isSaved ? "Saved!" : "Save Changes"}</span>
            </Button>
            <ErrorTooltip message={fieldErrors.general} />
          </div>
        </motion.div>

        {/* SECTION 1: STATUSES */}
        <motion.div variants={SPRING_CARD_VARIANTS} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-emerald-500" />
              Statuses{" "}
              <span className="text-muted-foreground font-medium text-[12px] ml-1">
                ({statuses.length})
              </span>
            </h3>
            <Button
              variant={ButtonVariant.Outline}
              size={ButtonSize.Sm}
              onClick={handleOpenAddStatus}
              className="h-8 text-[12px] flex items-center gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Status</span>
            </Button>
          </div>

          {statuses.length === 0 ? (
            <EmptyState
              icon={TagIcon}
              title="No Statuses Configured"
              description="Add custom statuses for issues in this workspace."
            />
          ) : (
            <div className="bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden flex flex-col w-full">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleStatusDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-10 px-3" />
                      <TableHead className="w-12 px-2">#</TableHead>
                      <TableHead className="w-40">Status Name</TableHead>
                      <TableHead className="w-32">Category</TableHead>
                      <TableHead className="w-32">Color</TableHead>
                      <TableHead>Preview</TableHead>
                      <TableHead className="w-20 text-right pr-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={statuses.map((s) => s.name)}
                      strategy={verticalListSortingStrategy}
                    >
                      {statuses.map((status, idx) => (
                        <SortableStatusRow
                          key={status.name}
                          status={status}
                          idx={idx}
                          onEdit={() => handleOpenEditStatus(idx)}
                          onDelete={() => handleDeleteStatus(idx)}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </motion.div>

        {/* SECTION 2: ISSUE TYPES */}
        <motion.div variants={SPRING_CARD_VARIANTS} className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-bold text-foreground flex items-center gap-2">
              <SlidersHorizontalIcon className="w-4 h-4 text-purple-500" />
              Issue Types{" "}
              <span className="text-muted-foreground font-medium text-[12px] ml-1">
                ({issueTypes.length})
              </span>
            </h3>
            <Button
              variant={ButtonVariant.Outline}
              size={ButtonSize.Sm}
              onClick={handleOpenAddType}
              className="h-8 text-[12px] flex items-center gap-1"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Issue Type</span>
            </Button>
          </div>

          {issueTypes.length === 0 ? (
            <EmptyState
              icon={SlidersHorizontalIcon}
              title="No Issue Types Configured"
              description="Add custom issue types for this workspace."
            />
          ) : (
            <div className="bg-card rounded-lg border border-border/60 shadow-sm overflow-hidden flex flex-col w-full">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleTypeDragEnd}
              >
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-10 px-3" />
                      <TableHead className="w-12 px-2">#</TableHead>
                      <TableHead className="w-40">Type Name</TableHead>
                      <TableHead className="w-28">Icon</TableHead>
                      <TableHead className="w-28">Color</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Allowed Parent Types</TableHead>
                      <TableHead className="w-28">Preview</TableHead>
                      <TableHead className="w-20 text-right pr-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <SortableContext
                      items={issueTypes.map((t) => t.name)}
                      strategy={verticalListSortingStrategy}
                    >
                      {issueTypes.map((type, idx) => (
                        <SortableTypeRow
                          key={type.name}
                          type={type}
                          idx={idx}
                          onEdit={() => handleOpenEditType(idx)}
                          onDelete={() => handleDeleteType(idx)}
                        />
                      ))}
                    </SortableContext>
                  </TableBody>
                </Table>
              </DndContext>
            </div>
          )}
        </motion.div>
      </div>

      {/* STATUS MODAL */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
      >
        <ModalContent maxWidth="max-w-[500px]">
          <ModalHeader
            title={
              editingStatusIndex !== null ? "Edit Status" : "Add New Status"
            }
          />
          <ModalBody>
            <div className="px-5 py-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 flex flex-col gap-1.5">
                  <InputLabel>Order (#)</InputLabel>
                  <Input
                    type="number"
                    value={statusForm.no ?? ""}
                    onChange={(e) =>
                      setStatusForm((p) => ({
                        ...p,
                        no: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <InputLabel required>Status Name</InputLabel>
                  <Input
                    value={statusForm.name}
                    onChange={(e) =>
                      setStatusForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. IN_REVIEW"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <InputLabel required>Category</InputLabel>
                <Select
                  value={statusForm.category}
                  onChange={(val) =>
                    setStatusForm((p) => ({ ...p, category: val }))
                  }
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <InputLabel>Color Hex Code</InputLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={statusForm.color || "#6B7280"}
                    onChange={(e) =>
                      setStatusForm((p) => ({ ...p, color: e.target.value }))
                    }
                    className="w-9 h-9 p-0.5 rounded cursor-pointer border border-border bg-card"
                  />
                  <Input
                    value={statusForm.color || ""}
                    onChange={(e) =>
                      setStatusForm((p) => ({ ...p, color: e.target.value }))
                    }
                    placeholder="#6B7280"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant={ButtonVariant.Outline}
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              onClick={handleSaveStatus}
              disabled={!statusForm.name.trim()}
            >
              Save Status
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ISSUE TYPE MODAL */}
      <Modal isOpen={isTypeModalOpen} onClose={() => setIsTypeModalOpen(false)}>
        <ModalContent maxWidth="max-w-[500px]">
          <ModalHeader
            title={
              editingTypeIndex !== null
                ? "Edit Issue Type"
                : "Add New Issue Type"
            }
          />
          <ModalBody>
            <div className="px-5 py-4 flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 flex flex-col gap-1.5">
                  <InputLabel>Order (#)</InputLabel>
                  <Input
                    type="number"
                    value={typeForm.no ?? ""}
                    onChange={(e) =>
                      setTypeForm((p) => ({
                        ...p,
                        no: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                    placeholder="1"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <InputLabel required>Issue Type Name</InputLabel>
                  <Input
                    value={typeForm.name}
                    onChange={(e) =>
                      setTypeForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. TASK, BUG, STORY"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <InputLabel required>Icon Identifier</InputLabel>
                <Select
                  value={typeForm.icon || "task"}
                  onChange={(val) => setTypeForm((p) => ({ ...p, icon: val }))}
                >
                  <option value="epic">epic (Lightning)</option>
                  <option value="story">story (Bookmark)</option>
                  <option value="check-square">check-square (Task)</option>
                  <option value="bug">bug (Bug)</option>
                  <option value="subtask">subtask (Corner Arrow)</option>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <InputLabel>Color Hex Code</InputLabel>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={typeForm.color || "#3b82f6"}
                    onChange={(e) =>
                      setTypeForm((p) => ({ ...p, color: e.target.value }))
                    }
                    className="w-9 h-9 p-0.5 rounded cursor-pointer border border-border bg-card"
                  />
                  <Input
                    value={typeForm.color || ""}
                    onChange={(e) =>
                      setTypeForm((p) => ({ ...p, color: e.target.value }))
                    }
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <InputLabel>Description</InputLabel>
                <Input
                  value={typeForm.description || ""}
                  onChange={(e) =>
                    setTypeForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="e.g. Yêu cầu người dùng"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1 border-t border-border/50">
                <InputLabel>Allowed Parent Types</InputLabel>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Select which issue types can be parents for this type. Leave
                  unselected if top-level (e.g. Epic).
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {issueTypes
                    .filter(
                      (t) =>
                        !typeForm.name ||
                        t.name.toLowerCase() !== typeForm.name.toLowerCase(),
                    )
                    .map((otherType) => {
                      const isChecked = (
                        typeForm.allowedParentTypes || []
                      ).some(
                        (p) => p.toLowerCase() === otherType.name.toLowerCase(),
                      );
                      return (
                        <label
                          key={otherType.name}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[12px] font-medium cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-card border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={isChecked}
                            onChange={() =>
                              handleToggleParentType(otherType.name)
                            }
                          />
                          <TypeIcon
                            type={otherType.name}
                            className="w-3.5 h-3.5 shrink-0"
                          />
                          <span>{otherType.name}</span>
                        </label>
                      );
                    })}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant={ButtonVariant.Outline}
              onClick={() => setIsTypeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariant.Primary}
              onClick={handleSaveType}
              disabled={!typeForm.name.trim()}
            >
              Save Issue Type
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
