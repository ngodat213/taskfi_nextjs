"use client";

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/actions/button";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { PasswordStrength } from "@/components/ui/forms/password-strength";
import { useSignup } from "@/features/auth/hooks/use-auth";
import {
  RegisterFormValues,
  getRegisterSchema,
} from "@/features/auth/schemas/auth.schema";
import { useRouter } from "@/i18n/routing";
import { handleFormError } from "@/utils/error";

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
    const payload = {
      full_name: data.full_name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    signup(payload, {
      onSuccess: () => {
        router.push(`/verify-otp?email=${encodeURIComponent(payload.email)}`);
      },
      onError: (err) => handleFormError(err, setError),
    });
  };

  const password = useWatch({ control, name: "password" });

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="p-3 text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div className="relative">
          <Label className="mb-1.5 block">Full Name</Label>
          <Input
            type="text"
            placeholder="Nguyen Van A"
            {...register("full_name")}
            className={
              errors.full_name
                ? "border-destructive focus:ring-destructive/20"
                : ""
            }
          />
          <ErrorTooltip message={errors.full_name?.message} />
        </div>

        <div className="relative">
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            placeholder="samlee.mobbin+1@gmail.com"
            {...register("email")}
            className={
              errors.email ? "border-destructive focus:ring-destructive/20" : ""
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
              errors.password
                ? "border-destructive focus:ring-destructive/20"
                : ""
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
