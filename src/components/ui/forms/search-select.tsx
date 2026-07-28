"use client";

import * as React from "react";
import {
  MagnifyingGlassIcon,
  CaretDownIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";

export interface SearchSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
  variant?: "default" | "pill";
  onSearchChange?: (query: string) => void;
  renderOption?: (option: SearchSelectOption) => React.ReactNode;
}

export function SearchSelect({
  options,
  value,
  onChange,
  placeholder = "Add or attach subtask...",
  className,
  disabled = false,
  clearable = false,
  variant = "default",
  onSearchChange,
  renderOption,
}: SearchSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(q)),
    );
  }, [options, searchQuery]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
    if (!isOpen) setIsOpen(true);
  };

  const handleSelect = (val: string, isDisabled?: boolean) => {
    if (isDisabled) return;
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.blur();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Inline Search Input Box */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            inputRef.current?.focus();
          }
        }}
        className={cn(
          "flex w-full items-center justify-between h-9 px-3.5 bg-card border text-[13px] font-medium transition-all cursor-text disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
          variant === "pill" ? "rounded-full" : "rounded-lg",
          isOpen
            ? "border-blue-500 ring-2 ring-blue-500/10"
            : "border-border hover:border-border/80",
          className,
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-1">
          {!searchQuery && selectedOption ? (
            selectedOption.icon ? (
              <div className="shrink-0 flex items-center justify-center">
                {selectedOption.icon}
              </div>
            ) : null
          ) : (
            <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          )}

          <div className="relative flex-1 min-w-0 flex items-center">
            <input
              ref={inputRef}
              type="text"
              disabled={disabled}
              placeholder={selectedOption ? "" : placeholder}
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={() => !disabled && setIsOpen(true)}
              className="w-full bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground font-medium text-[13px] relative z-10"
            />
            {!searchQuery && selectedOption && (
              <span className="absolute left-0 pointer-events-none text-foreground font-medium text-[13px] truncate max-w-full">
                {selectedOption.label}
              </span>
            )}
          </div>

          {!searchQuery && selectedOption?.badge && (
            <div className="shrink-0 flex items-center">
              {selectedOption.badge}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {(searchQuery || (clearable && selectedOption)) && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          )}
          <CaretDownIcon
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200 pointer-events-none",
              isOpen && "rotate-180",
            )}
          />
        </div>
      </div>

      {/* Direct Options Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-card border border-border rounded-lg shadow-xl max-h-64 flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
          <div className="overflow-y-auto py-1 flex-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-[13px] text-muted-foreground text-center font-medium">
                No results found
              </div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = value === option.value;
                return (
                  <div
                    key={`${option.value}-${idx}`}
                    onClick={() => handleSelect(option.value, option.disabled)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors outline-none",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted/80 active:bg-muted",
                      isSelected
                        ? "text-blue-600 bg-blue-50/60 dark:text-blue-400 dark:bg-blue-500/10"
                        : "text-foreground",
                    )}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                        {option.icon}
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-[11px] text-muted-foreground truncate">
                            {option.sublabel}
                          </span>
                        )}
                        {option.badge}
                      </div>
                    )}
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-1" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
