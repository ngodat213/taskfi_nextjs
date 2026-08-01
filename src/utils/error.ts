import { FieldValues, Path, UseFormSetError } from "react-hook-form";

export interface ApiErrorResponseData {
  success?: boolean;
  statusCode?: number;
  errorCode?: string;
  errorKey?: string;
  message?: string | string[];
  validationErrors?: Record<string, string[]>;
  details?: string;
}

export interface ApiErrorResponse {
  response?: {
    data?: ApiErrorResponseData;
  };
  message?: string;
}

export function formatErrorMessage(msg: string): string {
  if (typeof msg !== "string") return "An error occurred";
  if (
    msg.startsWith("issue.error.") ||
    msg.startsWith("auth.error.") ||
    msg.startsWith("project.error.")
  ) {
    const key = msg.split(".error.").pop()?.replaceAll("_", " ") || msg;
    return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  }
  return msg;
}

export interface MappedApiError {
  message: string;
  errorKey?: string;
  field?: string;
}

const ERROR_KEY_TO_FIELD: Record<string, string> = {
  "issue.error.TYPE_NOT_CONFIGURED": "type",
  "issue.error.CANNOT_CHANGE_TYPE_HAS_CHILDREN": "type",
  "issue.error.STATUS_NOT_CONFIGURED": "status",
  "issue.error.INVALID_PARENT_TYPE": "parentId",
  "issue.error.PARENT_NOT_FOUND": "parentId",
  "issue.error.PARENT_BELONGS_TO_ANOTHER_PROJECT": "parentId",
  "issue.error.CANNOT_PARENT_SELF": "parentId",
  "issue.error.CIRCULAR_PARENT_DEPENDENCY": "parentId",
  "issue.error.ASSIGNEE_NOT_IN_WORKSPACE": "assigneeId",
  "issue.error.ASSIGNEE_NOT_IN_PROJECT": "assigneeId",
  "issue.error.INVALID_DUE_DATE": "dueDate",
  "issue.error.CANNOT_LINK_SELF": "links",
  "issue.error.TARGET_NOT_FOUND": "links",
};

export function extractApiError(err: unknown): MappedApiError {
  const error = err as ApiErrorResponse;
  const data = error?.response?.data;
  const errorKey = data?.errorKey;

  const rawMsg =
    data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";
  const message = Array.isArray(rawMsg)
    ? rawMsg.map(formatErrorMessage).join(", ")
    : formatErrorMessage(String(rawMsg));

  const field = errorKey ? ERROR_KEY_TO_FIELD[errorKey] : undefined;

  return { message, errorKey, field };
}

export function getErrorMessage(err: unknown): string {
  return extractApiError(err).message;
}

export function handleFormError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
) {
  const error = err as ApiErrorResponse;
  const data = error?.response?.data;

  if (data?.validationErrors) {
    Object.entries(data.validationErrors).forEach(([field, messages]) => {
      setError(field as Path<T>, {
        type: "server",
        message: messages[0],
      });
    });
  } else {
    const { message } = extractApiError(err);
    setError("root", {
      type: "server",
      message,
    });
  }
}
