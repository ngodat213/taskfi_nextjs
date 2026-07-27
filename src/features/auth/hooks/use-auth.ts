import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/api/auth.service";
import {
  LogoutRequest,
  WrappedStatusResponseDto,
} from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      if (res.data) {
        const token = res.data.token || res.data.accessToken;
        setAuth(token as string, res.data.refreshToken);
        router.push("/workspaces");
      }
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<WrappedStatusResponseDto, Error, LogoutRequest | void>({
    mutationFn: (data) => authService.logout(data),
    onSettled: () => {
      logout();
      useWorkspaceStore.getState().clearWorkspace();
      queryClient.clear();
      router.push("/login");
    },
  });
}

export function useCurrentUser() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["current-user"],
    queryFn: authService.getCurrentUser,
    enabled: !!accessToken,
  });
}

// 2. Onboarding & Password Hooks
export function useSignup() {
  return useMutation({ mutationFn: authService.signup });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: authService.verifyEmail });
}

export function useResendSignupOtp() {
  return useMutation({ mutationFn: authService.resendSignupOtp });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authService.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: authService.resetPassword });
}

export function useRegisterFcmToken() {
  return useMutation({ mutationFn: authService.registerFcmToken });
}

export function useDeleteAccount() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      logout();
      router.push("/login");
    },
  });
}
