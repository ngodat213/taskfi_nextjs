"use client";

import { VerifyOtpForm } from "@/features/auth/components/verify-otp-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

import { Command } from "lucide-react";

export default function VerifyOtpPage() {
  return (
    <AuthLayout
      title="Check your email"
      description="We've sent a 6-digit verification code to your email address."
      icon={<Command className="w-8 h-8 text-foreground" />}
      footer={
        <Link
          href="/register"
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
          Back to Sign Up
        </Link>
      }
    >
      <VerifyOtpForm />
    </AuthLayout>
  );
}
