"use client";

import Link from "next/link";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-red-100 text-red-500 flex items-center justify-center rounded-full mb-2">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-medium text-slate-700">Page Not Found</h2>
        <p className="text-slate-500 max-w-[400px]">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant={ButtonVariant.Primary}>Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
