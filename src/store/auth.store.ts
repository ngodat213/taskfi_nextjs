import { create } from "zustand";
import { persist } from "zustand/middleware";

const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
};

const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAuth: (accessToken, refreshToken) => {
        setCookie("accessToken", accessToken);
        setCookie("refreshToken", refreshToken);
        set({ accessToken, refreshToken });
      },
      logout: () => {
        removeCookie("accessToken");
        removeCookie("refreshToken");
        set({ accessToken: null, refreshToken: null });
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
