"use client";

import { useForm } from "react-hook-form";
import { Link } from "@/i18n/routing";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { useLogin } from "@/features/auth/hooks/use-auth";
import { handleFormError } from "@/utils/error";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const getLoginSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email(t("invalid_email")),
    password: z.string().min(6, t("min_password")),
  });

type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;

export function LoginForm() {
  const t = useTranslations("Validation");
  const loginSchema = useMemo(() => getLoginSchema(t), [t]);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const { mutate: login, isPending: isLoading } = useLogin();

  const onSubmit = (data: LoginFormValues) => {
    setUnverifiedEmail(null);
    login(data, {
      onError: (err) => {
        const error = err as { response?: { data?: { errorCode?: string } } };
        if (error?.response?.data?.errorCode === "EMAIL_NOT_VERIFIED") {
          setUnverifiedEmail(data.email);
          setError("root", {
            type: "server",
            message: "Your email is not verified.",
          });
          return;
        }
        handleFormError(err, setError);
      },
    });
  };

  return (
    <div className="w-full">
      <Button
        variant={ButtonVariant.Outline}
        className="w-full py-2 mb-6"
        type="button"
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-slate-200/80" />
        <span className="px-3 text-[11px] text-slate-400 font-medium">or</span>
        <div className="flex-1 border-t border-slate-200/80" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="p-3 text-[13px] text-red-500 bg-red-50/50 border border-red-200/50 rounded-lg">
            {errors.root.message}{" "}
            {unverifiedEmail && (
              <Link
                href={`/verify-otp?email=${encodeURIComponent(
                  unverifiedEmail,
                )}`}
                className="font-medium underline hover:text-red-700"
              >
                Verify now
              </Link>
            )}
          </div>
        )}

        <div className="relative">
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            placeholder="samlee.mobbin+1@gmail.com"
            {...register("email")}
            className={
              errors.email ? "border-red-500 focus:ring-red-500/10" : ""
            }
          />
          <ErrorTooltip message={errors.email?.message} />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-1.5">
            <Label>Password</Label>
            <Link
              href="/forgot-password"
              className="text-[12px] text-slate-500 hover:text-slate-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••••••"
            {...register("password")}
            className={
              errors.password ? "border-red-500 focus:ring-red-500/10" : ""
            }
          />
          <ErrorTooltip message={errors.password?.message} />
        </div>

        <Button
          type="submit"
          className="w-full mt-2 py-2"
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
