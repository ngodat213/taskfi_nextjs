import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
;
import { useMemo } from "react";
import { cn } from "@/utils/cn";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const criteria = useMemo(() => {
    return [
      {
        label: "At least 12 characters",
        met: password.length >= 12,
      },
      {
        label: "Contains uppercase letter",
        met: /[A-Z]/.test(password),
      },
      {
        label: "Contains lowercase letter",
        met: /[a-z]/.test(password),
      },
      {
        label: "Contains number",
        met: /\d/.test(password),
      },
      {
        label: "Contains special character",
        met: /[^A-Za-z0-9]/.test(password),
      },
      {
        label: "No common weak patterns",
        met:
          password.length > 0 &&
          !/(password|12345|qwerty|admin)/i.test(password),
      },
    ];
  }, [password]);

  if (!password) return null;

  const metCount = criteria.filter((c) => c.met).length;
  const total = criteria.length;
  const score = metCount / total;

  let strengthLabel = "Weak";
  let barColor = "bg-red-500";
  let labelColor = "text-red-500";

  if (score === 1) {
    strengthLabel = "Strong";
    barColor = "bg-[#5E9B6A]";
    labelColor = "text-[#5E9B6A]";
  } else if (score >= 0.5) {
    strengthLabel = "Fair";
    barColor = "bg-yellow-500";
    labelColor = "text-yellow-500";
  }

  return (
    <div className="mt-2 w-full animate-in fade-in slide-in-from-top-1">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] font-medium text-muted-foreground">
          Password strength
        </span>
        <span className={cn("text-[13px] font-medium", labelColor)}>
          {strengthLabel}
        </span>
      </div>

      <div className="h-1.5 w-full bg-[#333333] rounded-full overflow-hidden mb-1.5">
        <div
          className={cn("h-full transition-all duration-300", barColor)}
          style={{ width: `${(metCount / total) * 100}%` }}
        />
      </div>

      <p className="text-[12px] text-muted-foreground mb-3">
        {score === 1 ? "Password is strong!" : "Password must contain:"}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
        {criteria.map((c, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-[12px] transition-colors",
              c.met ? "text-[#5E9B6A]" : "text-muted-foreground",
            )}
          >
            <CheckIcon className="w-3.5 h-3.5" />
            <span className={c.met ? "line-through opacity-80" : ""}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
