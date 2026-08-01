"use client";
import { CommandIcon } from "@phosphor-icons/react/dist/ssr";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { Link } from "@/i18n/routing";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create new password"
      description="Please enter the verification code sent to your email and your new password."
      icon={<CommandIcon className="w-8 h-8 text-foreground" />}
      footer={
        <Link
          href="/forgot-password"
          className="text-foreground font-medium hover:underline flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
