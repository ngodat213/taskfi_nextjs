import { X } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
import { createPortal } from "react-dom";
;
import { cn } from "@/utils/cn";

// Context to share onClose down to ModalHeader/Footer
const ModalContext = React.createContext<{ onClose: () => void } | null>(null);

function useModal() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isOpen || !isClient || typeof document === "undefined") return null;

  return createPortal(
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        {children}
      </div>
    </ModalContext.Provider>,
    document.body,
  );
}

export interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
}

export const ModalContent = React.forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, maxWidth = "max-w-[600px]", children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full bg-secondary rounded-[20px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200",
        maxWidth,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
ModalContent.displayName = "ModalContent";

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  icon?: React.ReactNode;
  hideCloseButton?: boolean;
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, icon, hideCloseButton = false, ...props }, ref) => {
    const { onClose } = useModal();
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between px-5 py-3.5",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-[13px] font-medium">{title}</span>
        </div>
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  },
);
ModalHeader.displayName = "ModalHeader";

export const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className="px-3 pb-3 flex-1 overflow-hidden" {...props}>
    <div
      ref={ref}
      className={cn(
        "bg-card rounded-[16px] border border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      {children}
    </div>
  </div>
));
ModalBody.displayName = "ModalBody";

export interface ModalScrollAreaProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  rightElement?: React.ReactNode;
  errorMessage?: React.ReactNode;
}

export const ModalScrollArea = React.forwardRef<
  HTMLDivElement,
  ModalScrollAreaProps
>(
  (
    {
      className,
      children,
      title,
      description,
      rightElement,
      errorMessage,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "p-5 sm:p-6 flex flex-col max-h-[75vh] overflow-y-auto custom-scrollbar",
        className,
      )}
      {...props}
    >
      {(title || description || rightElement || errorMessage) && (
        <div className="mb-6 flex flex-col gap-4">
          <div>
            <div className="flex items-start justify-between">
              {title && (
                <h2 className="text-[18px] font-semibold text-foreground tracking-tight">
                  {title}
                </h2>
              )}
              {rightElement && (
                <div className="shrink-0 ml-4">{rightElement}</div>
              )}
            </div>
            {description && (
              <p className="text-[13.5px] text-muted-foreground mt-1.5">
                {description}
              </p>
            )}
          </div>
          {errorMessage && (
            <div className="p-3 text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  ),
);
ModalScrollArea.displayName = "ModalScrollArea";

export const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-5 sm:px-6 py-4 border-t border-border flex items-center justify-end gap-2.5 bg-card",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
ModalFooter.displayName = "ModalFooter";
