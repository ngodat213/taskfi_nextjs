export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_SIGNUP_OTP: "/auth/resend-signup-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FCM_TOKEN: "/auth/fcm-token",
    ACCOUNT: "/auth/account",
    REFRESH: "/auth/refresh",
  },
  WORKSPACES: {
    LIST: "/workspaces",
    CREATE: "/workspaces",
    AI_GENERATE: (workspaceId: string) =>
      `/workspaces/${workspaceId}/issues/ai-generate`,
  },
  UPLOADS: {
    UPLOAD: "/uploads/image",
    DELETE: "/uploads/image",
    IMAGE: "/uploads/image",
  },
  GROUPS: {
    BASE: "/groups",
  },
  PROJECTS: {
    BASE: "/projects",
  },
  TEAMS: {
    BASE: "/teams",
  },
  ISSUES: {
    BASE: "/issues",
    COMMENTS: (issueId: string) => `/issues/${issueId}/comments`,
    ACTIVITIES: (issueId: string) => `/issues/${issueId}/activities`,
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
  },
  RETROS: {
    BASE: "/retros",
  },
} as const;
