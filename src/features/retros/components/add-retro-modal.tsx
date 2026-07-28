"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChatTextIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { FormInput } from "@/components/ui/forms/form-input";
import { TextEditor } from "@/components/ui/forms/text-editor";
import { Select } from "@/components/ui/forms/select";
import { InputLabel } from "@/components/ui/forms/input-label";
import { RetroItem } from "@/types/retro.types";
import {
  addRetroSchema,
  AddRetroFormValues,
  DEFAULT_ADD_RETRO_VALUES,
} from "@/features/retros/schemas/add-retro.schema";

interface AddRetroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (
    note: Omit<
      RetroItem,
      "id" | "authorName" | "authorAvatar" | "votes" | "createdAt"
    >,
  ) => void;
}

export function AddRetroModal({
  isOpen,
  onClose,
  onAddNote,
}: AddRetroModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AddRetroFormValues>({
    resolver: zodResolver(addRetroSchema),
    defaultValues: DEFAULT_ADD_RETRO_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      reset(DEFAULT_ADD_RETRO_VALUES);
    }
  }, [isOpen, reset]);

  const onSubmit = (data: AddRetroFormValues) => {
    const rawTagString = data.tag || data.tags?.[0] || "General";
    const tagList = rawTagString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onAddNote({
      category: data.category,
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      tag: tagList[0] || "General",
      tags: tagList.length > 0 ? tagList : ["General"],
    });

    reset(DEFAULT_ADD_RETRO_VALUES);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-[680px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader
            title="Add Retrospective Note"
            icon={<ChatTextIcon className="w-4 h-4 text-blue-500" />}
          />

          <ModalBody>
            <ModalScrollArea className="px-5 py-4 flex flex-col gap-4">
              {/* Category */}
              <div className="flex flex-col gap-2 relative">
                <InputLabel required>Category</InputLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={(val) => field.onChange(val)}
                    >
                      <option value="went_well">
                        What Went Well (Điểm làm tốt)
                      </option>
                      <option value="to_improve">
                        What Can Be Improved (Cần cải thiện)
                      </option>
                      <option value="action_item">
                        Action Item (Hành động cải tiến)
                      </option>
                    </Select>
                  )}
                />
                {errors.category?.message && (
                  <span className="text-[11px] font-medium text-destructive mt-1">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* Title */}
              <FormInput
                label="Title"
                required
                placeholder="Enter key takeaway or action item..."
                {...register("title")}
                error={errors.title?.message}
              />

              {/* Description */}
              <div className="flex flex-col gap-2 relative">
                <InputLabel>Description (Optional)</InputLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextEditor
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Add details or context..."
                    />
                  )}
                />
                {errors.description?.message && (
                  <span className="text-[11px] font-medium text-destructive mt-1">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Tag / Label */}
              <FormInput
                label="Tag / Label"
                placeholder="e.g. DevOps, Frontend, QA"
                {...register("tag")}
                error={errors.tag?.message}
              />
            </ModalScrollArea>

            <ModalFooter>
              <Button
                type="button"
                variant={ButtonVariant.Ghost}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant={ButtonVariant.Primary}>
                Create Note
              </Button>
            </ModalFooter>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
