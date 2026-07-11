"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

import { Command } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth.login");

  return (
    <AuthLayout
      title={t("title")}
      description={t("description")}
      icon={<Command className="w-8 h-8 text-slate-900" />}
      footer={
        <>
          <span className="text-slate-500">Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}
