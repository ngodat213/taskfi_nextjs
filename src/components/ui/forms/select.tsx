import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
import { cn } from "@/utils/cn";
export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  wrapperClassName?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  onSearchChange?: (query: string) => void;
  variant?: "default" | "pill";
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      children,
      value,
      defaultValue,
      onChange,
      wrapperClassName,
      className,
      disabled,
      placeholder,
      searchable = false,
      onSearchChange,
      variant,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    // Extract options from children for backwards compatibility
    const options: { label: string; value: string; disabled?: boolean }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === "option") {
        const props =
          child.props as React.OptionHTMLAttributes<HTMLOptionElement>;

        let label = "";
        if (Array.isArray(props.children)) {
          label = props.children.join("");
        } else if (props.children !== undefined && props.children !== null) {
          label = props.children.toString();
        }

        options.push({
          label,
          value: props.value?.toString() || "",
          disabled: props.disabled,
        });
      }
    });

    // Determine initial value
    let initialValue = "";
    if (value !== undefined) {
      initialValue = value as string;
    } else if (defaultValue !== undefined) {
      initialValue = defaultValue as string;
    } else if (options.length > 0) {
      initialValue = options[0].value;
    }
    const [internalValue, setInternalValue] = React.useState(initialValue);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

    // Debounce search query to parent
    React.useEffect(() => {
      const handler = setTimeout(() => {
        onSearchChange?.(searchQuery);
      }, 300);
      return () => clearTimeout(handler);
    }, [searchQuery, onSearchChange]);

    // Click outside to close
    React.useEffect(() => {
      const handleOutsideClick = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      if (isOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
        if (searchable && searchInputRef.current) {
          setTimeout(() => searchInputRef.current?.focus(), 0);
        }
      } else {
        setSearchQuery("");
      }
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen, searchable]);

    const selectedOption =
      options.find((opt) => opt.value === internalValue) || options[0];

    const filteredOptions = searchable
      ? onSearchChange
        ? options // Parent handles filtering
        : options.filter((opt) =>
            opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
          )
      : options;

    const handleSelect = (val: string, isDisabled?: boolean) => {
      if (isDisabled) return;
      setInternalValue(val);
      onChange?.(val);
      setIsOpen(false);
    };

    return (
      <div
        ref={(node) => {
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
          containerRef.current = node;
        }}
        className={cn("relative w-full", wrapperClassName)}
        {...props}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between h-9 px-3.5 bg-card border text-[13px] font-medium focus:outline-none focus:border-blue-500 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
            variant === "pill" ? "rounded-full" : "rounded-lg",
            isOpen
              ? "border-blue-500 hover:border-blue-500"
              : "border-border hover:border-border",
            !selectedOption || selectedOption.value === ""
              ? "text-muted-foreground"
              : "text-foreground",
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder || "Select..."}
          </span>
          <CaretDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-card border border-border rounded-lg shadow-lg max-h-60 flex flex-col animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-border bg-muted/50">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 px-3 text-[13px] bg-card border border-border rounded-full focus:outline-none focus:ring-0 focus:border-blue-500 dark:focus:border-blue-500 placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div className="overflow-y-auto py-1.5 flex-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-[13px] text-muted-foreground text-center">
                  No results found
                </div>
              ) : (
                filteredOptions.map((option, idx) => (
                  <div
                    key={`${option.value}-${idx}`}
                    onClick={() => handleSelect(option.value, option.disabled)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors outline-none",
                      option.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-muted",
                      internalValue === option.value
                        ? "text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
                        : "text-foreground",
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {internalValue === option.value && (
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
