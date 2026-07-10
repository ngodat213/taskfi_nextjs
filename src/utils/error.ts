import { UseFormSetError, FieldValues, Path } from "react-hook-form";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errorCode?: string;
  validationErrors?: Record<string, string[]>;
  details?: string;
}

export function getErrorMessage(err: unknown): string {
  const error = err as { response?: { data?: ApiErrorResponse } };
  return (
    error?.response?.data?.message || "Something went wrong. Please try again."
  );
}

export function handleFormError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
) {
  const error = err as { response?: { data?: ApiErrorResponse } };
  const data = error?.response?.data;

  if (data?.validationErrors) {
    Object.entries(data.validationErrors).forEach(([field, messages]) => {
      setError(field as Path<T>, {
        type: "server",
        message: messages[0],
      });
    });
  } else {
    setError("root", {
      type: "server",
      message: data?.message || "Something went wrong. Please try again.",
    });
  }
}
