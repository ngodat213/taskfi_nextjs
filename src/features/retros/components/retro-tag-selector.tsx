"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { AVAILABLE_TAGS } from "@/features/retros/constants/retro.constants";

interface RetroTagSelectorProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function RetroTagSelector({
  tags,
  onAddTag,
  onRemoveTag,
}: RetroTagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tags.map((tagItem) => (
        <span
          key={tagItem}
          className="bg-secondary text-foreground px-2 py-0.5 rounded border border-border/80 font-semibold text-xs inline-flex items-center gap-1.5 group"
        >
          #{tagItem}
          {tags.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveTag(tagItem)}
              className="text-muted-foreground hover:text-red-500 opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
              title="Remove tag"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}

      {/* Add Tag Dropdown Button */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted rounded border border-dashed border-border transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>Tag</span>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-44 bg-card border border-border rounded-lg shadow-lg z-50 py-1.5 flex flex-col max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40">
              Select Tags
            </div>
            {AVAILABLE_TAGS.map((opt) => {
              const isSelected = tags.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onRemoveTag(opt);
                    } else {
                      onAddTag(opt);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center justify-between px-3 py-1.5 text-xs hover:bg-muted text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-muted/60 font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span>#{opt}</span>
                  {isSelected && (
                    <span className="text-blue-500 font-bold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
