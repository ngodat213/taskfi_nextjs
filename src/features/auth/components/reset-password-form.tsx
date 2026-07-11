"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/actions/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { useResetPassword } from "@/features/auth/hooks/use-auth";
import { handleFormError } from "@/utils/error";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { PasswordStrength } from "@/components/ui/forms/password-strength";
import { Suspense, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

const getResetPasswordSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email(t("invalid_email")),
    otp: z.string().min(6, t("min_code")),
    newPassword: z.string().min(6, t("min_password")),
  });

type ResetPasswordValues = z.infer<ReturnType<typeof getResetPasswordSchema>>;

function ResetPasswordFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email");
  const t = useTranslations("Validation");
  const resetPasswordSchema = useMemo(() => getResetPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors, isValid, isSubmitSuccessful },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: emailQuery || "",
    },
  });

  useEffect(() => {
    if (emailQuery) {
      setValue("email", emailQuery);
    }
  }, [emailQuery, setValue]);

  const { mutate: resetPassword, isPending: isLoading } = useResetPassword();

  const onSubmit = (data: ResetPasswordValues) => {
    resetPassword(data, {
      onSuccess: () => {},
      onError: (err) => handleFormError(err, setError),
    });
  };

  const newPassword = useWatch({ control, name: "newPassword" });

  if (isSubmitSuccessful) {
    return (
      <div className="w-full text-center space-y-4">
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-[14px] text-emerald-800 leading-relaxed font-medium">
            Password reset successfully!
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full mt-2 py-2"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="p-3 text-[13px] text-red-500 bg-red-50/50 border border-red-200/50 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="relative">
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            placeholder="samlee.mobbin+1@gmail.com"
            {...register("email")}
            readOnly={!!emailQuery}
            className={
              errors.email
                ? "border-red-500 focus:ring-red-500/10"
                : emailQuery
                  ? "bg-slate-50 text-slate-500"
                  : ""
            }
          />
          <ErrorTooltip message={errors.email?.message} />
        </div>

        <div className="relative">
          <Label className="mb-1.5 block">Verification Code (OTP)</Label>
          <Input
            type="text"
            placeholder="123456"
            {...register("otp")}
            className={errors.otp ? "border-red-500 focus:ring-red-500/10" : ""}
          />
          <ErrorTooltip message={errors.otp?.message} />
        </div>

        <div className="relative">
          <Label className="mb-1.5 block">New Password</Label>
          <Input
            type="password"
            placeholder="••••••••••••"
            {...register("newPassword")}
            className={
              errors.newPassword ? "border-red-500 focus:ring-red-500/10" : ""
            }
          />
          <ErrorTooltip message={errors.newPassword?.message} />
        </div>
        <PasswordStrength password={newPassword} />

        <Button
          type="submit"
          className="w-full mt-2 py-2"
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </div>
  );
}

export function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ResetPasswordFormInner />
    </Suspense>
  );
}
