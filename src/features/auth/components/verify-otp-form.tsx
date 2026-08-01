"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/actions/button";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  useResendSignupOtp,
  useVerifyEmail,
} from "@/features/auth/hooks/use-auth";
import {
  VerifyOtpValues,
  getVerifyOtpSchema,
} from "@/features/auth/schemas/auth.schema";
import { useRouter } from "@/i18n/routing";
import { handleFormError } from "@/utils/error";

function VerifyOtpFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailQuery = searchParams.get("email");
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("Validation");
  const verifyOtpSchema = useMemo(() => getVerifyOtpSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email: emailQuery || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (emailQuery) {
      setValue("email", emailQuery);
    }
  }, [emailQuery, setValue]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resendOtp, isPending: isResending } = useResendSignupOtp();

  const onSubmit = (data: VerifyOtpValues) => {
    verifyOtp(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: (err) => handleFormError(err, setError),
    });
  };

  const handleResendOtp = () => {
    if (cooldown > 0 || isResending) return;

    const email = getValues("email");
    if (!email || errors.email) {
      setError("email", {
        type: "manual",
        message: "Please enter a valid email to resend.",
      });
      return;
    }

    resendOtp(email, {
      onSuccess: () => {
        setResendMessage("Verification code sent!");
        setCooldown(60);
        setTimeout(() => setResendMessage(""), 5000);
      },
      onError: (err) => {
        setResendMessage("");
        handleFormError(err, setError);
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center space-y-4">
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <p className="text-[14px] text-emerald-800 leading-relaxed font-medium">
            Email verified successfully!
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full mt-2 py-2"
        >
          Proceed to Login
        </Button>
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

        {resendMessage && (
          <div className="p-3 text-[13px] text-emerald-700 bg-emerald-50/50 border border-emerald-200/50 rounded-lg">
            {resendMessage}
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
                ? "border-destructive focus:ring-destructive/20"
                : emailQuery
                  ? "bg-muted text-muted-foreground"
                  : ""
            }
          />
          <ErrorTooltip message={errors.email?.message} />
        </div>

        <div className="relative">
          <Label className="mb-1.5 block">Verification Code</Label>
          <Input
            type="text"
            placeholder="123456"
            {...register("otp")}
            className={
              errors.otp ? "border-destructive focus:ring-destructive/20" : ""
            }
          />
          <ErrorTooltip message={errors.otp?.message} />
        </div>

        <Button
          type="submit"
          className="w-full mt-2 py-2"
          disabled={isVerifying || !isValid}
        >
          {isVerifying ? "Verifying..." : "Verify Email"}
        </Button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending || cooldown > 0}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            {isResending
              ? "Sending..."
              : cooldown > 0
                ? `Resend code in (${cooldown}s)`
                : "Didn't receive a code? Resend"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function VerifyOtpForm() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <VerifyOtpFormInner />
    </Suspense>
  );
}
