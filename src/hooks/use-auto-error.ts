import { useState, useCallback } from "react";
import { extractApiError } from "@/utils/error";

export function useAutoError() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback(
    (field: string, message: string, timeout = 5000) => {
      setFieldErrors((prev) => ({ ...prev, [field]: message }));
      if (message && timeout > 0) {
        setTimeout(() => {
          setFieldErrors((prev) => ({ ...prev, [field]: "" }));
        }, timeout);
      }
    },
    [],
  );

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleApiError = useCallback(
    (err: unknown, defaultField?: string) => {
      const { message, field: mappedField } = extractApiError(err);
      const targetField = mappedField || defaultField || "root";
      setFieldError(targetField, message);
      return { message, field: targetField };
    },
    [setFieldError],
  );

  return {
    fieldErrors,
    setFieldError,
    clearFieldError,
    handleApiError,
  };
}
