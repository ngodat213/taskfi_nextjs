"use client";
import { Command } from "@phosphor-icons/react/dist/ssr";

import { LoginForm } from "@/features/auth/components/login-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

;
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("Auth.login");

  return (
    <AuthLayout
      title={t("title")}
      description={t("description")}
      icon={<Command className="w-8 h-8 text-foreground" />}
      footer={
        <>
          <span className="text-muted-foreground">Don&apos;t have an account?</span>
          <Link
            href="/register"
            className="text-foreground font-medium hover:underline"
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
