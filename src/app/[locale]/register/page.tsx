"use client";
import { useTranslations } from "next-intl";

import { CommandIcon } from "@phosphor-icons/react/dist/ssr";

import { AuthLayout } from "@/features/auth/components/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { Link } from "@/i18n/routing";

export default function RegisterPage() {
  const t = useTranslations("Auth.register");

  return (
    <AuthLayout
      title={t("title")}
      description={t("description")}
      icon={<CommandIcon className="w-8 h-8 text-foreground" />}
      footer={
        <>
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}
