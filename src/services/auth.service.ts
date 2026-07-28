import { apiClient } from "@/lib/axios";
import {
  LoginRequest,
  SignupRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  FcmTokenRequest,
  LogoutRequest,
  UpdateProfileRequest,
  WrappedTokenResponseDto,
  WrappedUserResponseDto,
  WrappedStatusResponseDto,
} from "@/types/auth.types";
import { API_ENDPOINTS } from "@/config/api-endpoints";

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<WrappedTokenResponseDto>(
      API_ENDPOINTS.AUTH.LOGIN,
      data,
    );
    return response.data;
  },

  signup: async (data: SignupRequest) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.SIGNUP,
      data,
    );
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      data,
    );
    return response.data;
  },

  resendSignupOtp: async (email: string) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.RESEND_SIGNUP_OTP,
      { email },
    );
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      data,
    );
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data,
    );
    return response.data;
  },

  logout: async (data: LogoutRequest | void = {}) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.LOGOUT,
      data || {},
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<WrappedUserResponseDto>(
      API_ENDPOINTS.AUTH.ME,
    );
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.patch<WrappedUserResponseDto>(
      API_ENDPOINTS.AUTH.ME,
      data,
    );
    return response.data;
  },

  registerFcmToken: async (data: FcmTokenRequest) => {
    const response = await apiClient.post<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.FCM_TOKEN,
      data,
    );
    return response.data;
  },

  deleteAccount: async () => {
    const response = await apiClient.delete<WrappedStatusResponseDto>(
      API_ENDPOINTS.AUTH.ACCOUNT,
    );
    return response.data;
  },
};
