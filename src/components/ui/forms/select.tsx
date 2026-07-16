import * as React from "react";
import { cn } from "@/utils/cn";
import { ChevronDown, Check } from "lucide-react";

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
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    // Extract options from children for backwards compatibility
    const options: { label: string; value: string; disabled?: boolean }[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.type === "option") {
        const props =
          child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
        options.push({
          label: props.children?.toString() || "",
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

    React.useEffect(() => {
      if (value !== undefined) setInternalValue(value);
    }, [value]);

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
      }
      return () =>
        document.removeEventListener("mousedown", handleOutsideClick);
    }, [isOpen]);

    const selectedOption =
      options.find((opt) => opt.value === internalValue) || options[0];

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
            "flex w-full items-center justify-between h-10 px-3 bg-white border border-slate-200 shadow-sm rounded-md text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50",
            !selectedOption || selectedOption.value === ""
              ? "text-slate-500"
              : "text-slate-700",
            isOpen && "border-blue-500 ring-2 ring-blue-500",
            className,
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder || "Select..."}
          </span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-slate-400 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 max-h-60 overflow-auto animate-in fade-in zoom-in-95 duration-100">
            {options.map((option, idx) => (
              <div
                key={`${option.value}-${idx}`}
                onClick={() => handleSelect(option.value, option.disabled)}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-[13px] font-medium cursor-pointer transition-colors outline-none",
                  option.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-slate-50",
                  internalValue === option.value
                    ? "text-blue-600 bg-blue-50/50 hover:bg-blue-50/50"
                    : "text-slate-700",
                )}
              >
                <span className="truncate">{option.label}</span>
                {internalValue === option.value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
