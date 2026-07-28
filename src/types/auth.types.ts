import { UploadedFile } from "@/types/api.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password?: string;
  full_name: string;
  username?: string;
}

export interface LogoutRequest {
  logoutAll?: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface FcmTokenRequest {
  token: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  avatarPublicId?: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  full_name?: string;
  avatar?: UploadedFile | null;
  avatar_public_id?: string;
  job_title?: string;
  department?: string;
  global_role?: string;
  role?: string;
  status?: string;
  is_email_verified?: boolean;
}

export interface TokenResponseDto {
  accessToken?: string;
  token?: string;
  refreshToken: string;
}

export interface WrappedTokenResponseDto {
  data: TokenResponseDto;
  message?: string;
  statusCode?: number;
}

export interface WrappedUserResponseDto {
  data: UserResponseDto;
  message?: string;
  statusCode?: number;
}

export interface WrappedStatusResponseDto {
  data?: unknown;
  message?: string;
  statusCode?: number;
}
