"use client";

import { CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";

interface RetroSidebarStatusProps {
  completed: boolean;
  onToggleComplete: () => void;
}

export function RetroSidebarStatus({
  completed,
  onToggleComplete,
}: RetroSidebarStatusProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-card border border-border/80 rounded-xl p-4 shadow-xs flex flex-col gap-3 text-xs">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 pb-2">
          Trạng thái Action
        </h4>
        <Button
          variant={completed ? ButtonVariant.Outline : ButtonVariant.Primary}
          size={ButtonSize.Sm}
          onClick={onToggleComplete}
          className="w-full text-xs h-8"
        >
          <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
          {completed ? "Đã hoàn thành (Done)" : "Đánh dấu hoàn thành"}
        </Button>
      </div>
    </div>
  );
}
