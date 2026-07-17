"use client";

import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

import { Command } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password."
      icon={<Command className="w-8 h-8 text-foreground" />}
      footer={
        <Link
          href="/login"
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
          Back to login
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
