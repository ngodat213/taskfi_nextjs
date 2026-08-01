"use client";
import { useTranslations } from "next-intl";

import { CommandIcon } from "@phosphor-icons/react/dist/ssr";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { Link } from "@/i18n/routing";

export default function LoginPage() {
  const t = useTranslations("Auth.login");

  return (
    <AuthLayout
      title={t("title")}
      description={t("description")}
      icon={<CommandIcon className="w-8 h-8 text-foreground" />}
      footer={
        <>
          <span className="text-muted-foreground">
            Don&apos;t have an account?
          </span>
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
