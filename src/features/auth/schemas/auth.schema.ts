import { z } from "zod";

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;
export const OTP_REGEX = /^\d{6}$/;
export const FULL_NAME_REGEX = /^[^<>]*$/;

export const getRegisterSchema = (t: (key: string) => string) =>
  z.object({
    full_name: z
      .string()
      .min(1, "Full name is required")
      .max(255, "Full name must not exceed 255 characters")
      .regex(FULL_NAME_REGEX, "Full name cannot contain HTML or script tags"),
    email: z.string().trim().toLowerCase().email(t("invalid_email")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, digit, and special character",
      ),
  });

export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().toLowerCase().email(t("invalid_email")),
    password: z.string().min(1, t("min_password")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;

export const getVerifyOtpSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().toLowerCase().email(t("invalid_email")),
    otp: z
      .string()
      .regex(OTP_REGEX, "Verification code must be exactly 6 digits"),
  });

export type VerifyOtpValues = z.infer<ReturnType<typeof getVerifyOtpSchema>>;

export const getForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().toLowerCase().email(t("invalid_email")),
  });

export type ForgotPasswordValues = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;

export const getResetPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().trim().toLowerCase().email(t("invalid_email")),
    otp: z
      .string()
      .regex(OTP_REGEX, "Verification code must be exactly 6 digits"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        PASSWORD_REGEX,
        "Password must contain uppercase, lowercase, digit, and special character",
      ),
  });

export type ResetPasswordValues = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;
