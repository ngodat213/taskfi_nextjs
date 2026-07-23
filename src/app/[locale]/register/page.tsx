"use client";
import { Command } from "@phosphor-icons/react/dist/ssr";

import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

;
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth.register');

  return (
    <AuthLayout
      title={t('title')}
      description={t('description')}
      icon={<Command className="w-8 h-8 text-foreground" />}
      footer={
        <>
          <span className="text-muted-foreground">Already have an account?</span>
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
