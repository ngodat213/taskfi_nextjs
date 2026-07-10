export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password?: string;
  username?: string;
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

export interface UserResponseDto {
  id: string;
  email: string;
  name?: string;
}

export interface TokenResponseDto {
  accessToken: string;
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
