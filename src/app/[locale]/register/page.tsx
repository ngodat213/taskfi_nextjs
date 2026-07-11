"use client";

import { RegisterForm } from "@/features/auth/components/register-form";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Link } from "@/i18n/routing";

import { Command } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth.register');

  return (
    <AuthLayout
      title={t('title')}
      description={t('description')}
      icon={<Command className="w-8 h-8 text-slate-900" />}
      footer={
        <>
          <span className="text-slate-500">Already have an account?</span>
          <Link
            href="/login"
            className="text-slate-900 font-medium hover:underline"
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
