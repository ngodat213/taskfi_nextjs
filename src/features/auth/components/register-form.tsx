"use client";

import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/features/auth/hooks/use-auth";
import { handleFormError } from "@/utils/error";
import { ErrorTooltip } from "@/components/ui/error-tooltip";
import { PasswordStrength } from "@/components/ui/password-strength";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const getRegisterSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    username: z.string().min(3, t("min_username")).optional(),
    email: z.string().email(t("invalid_email")),
    password: z.string().min(6, t("min_password")),
  });

type RegisterFormValues = z.infer<ReturnType<typeof getRegisterSchema>>;

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations("Validation");
  const registerSchema = useMemo(() => getRegisterSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const { mutate: signup, isPending: isLoading } = useSignup();

  const onSubmit = (data: RegisterFormValues) => {
    signup(data, {
      onSuccess: () => {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      },
      onError: (err) => handleFormError(err, setError),
    });
  };

  const password = useWatch({ control, name: "password" });

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="p-3 text-[13px] text-red-500 bg-red-50/50 border border-red-200/50 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="relative">
          <Label className="mb-1.5 block">Username (Optional)</Label>
          <Input
            type="text"
            placeholder="johndoe"
            {...register("username")}
            className={
              errors.username ? "border-red-500 focus:ring-red-500/10" : ""
            }
          />
          <ErrorTooltip message={errors.username?.message} />
        </div>

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
          <Label className="mb-1.5 block">Password</Label>
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
        <PasswordStrength password={password} />

        <Button
          type="submit"
          className="w-full mt-2 py-2"
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
