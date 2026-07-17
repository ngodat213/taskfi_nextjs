"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/actions/button";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import { useForgotPassword } from "@/features/auth/hooks/use-auth";
import { handleFormError } from "@/utils/error";
import { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const getForgotPasswordSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email(t("invalid_email")),
  });

type ForgotPasswordValues = z.infer<ReturnType<typeof getForgotPasswordSchema>>;

export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const t = useTranslations("Validation");
  const forgotPasswordSchema = useMemo(() => getForgotPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const { mutate: forgotPassword, isPending: isLoading } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordValues) => {
    forgotPassword(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setIsSuccess(true);
      },
      onError: (err) => handleFormError(err, setError),
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center space-y-4">
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-[14px] text-emerald-800 leading-relaxed">
            We sent a password reset link to <br />
            <span className="font-semibold">{submittedEmail}</span>
          </p>
        </div>
        <p className="text-[13px] text-muted-foreground">
          Didn&apos;t receive the email?{" "}
          <button
            onClick={() => setIsSuccess(false)}
            className="text-foreground font-medium hover:underline"
          >
            Try another email
          </button>{" "}
          or{" "}
          <Link
            href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
            className="text-foreground font-medium hover:underline"
          >
            Enter OTP manually
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {errors.root && (
          <div className="p-3 text-[13px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            {errors.root.message}
          </div>
        )}

        <div>
          <Label className="mb-1.5 block">Email</Label>
          <Input
            type="email"
            placeholder="samlee.mobbin+1@gmail.com"
            {...register("email")}
            className={
              errors.email ? "border-destructive focus:ring-destructive/20" : ""
            }
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full mt-2 py-2"
          disabled={isLoading || !isValid}
        >
          {isLoading ? "Sending link..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
