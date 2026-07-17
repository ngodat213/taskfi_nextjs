"use client";

import Link from "next/link";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background px-4 font-sans text-foreground overflow-hidden">
      {/* Abstract Blurred Background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-linear-to-br from-blue-100/60 via-sky-50/30 to-transparent blur-[100px] dark:hidden pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[500px] bg-linear-to-tl from-sky-100/60 via-blue-50/30 to-transparent blur-[100px] dark:hidden pointer-events-none z-0" />

      <div className="relative z-10 p-10 max-w-md w-full text-center flex flex-col items-center gap-5">
        <div className="w-20 h-20 bg-red-100/80 backdrop-blur-md text-red-500 flex items-center justify-center rounded-2xl mb-2 shadow-sm border border-red-200/50">
          <AlertCircle className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight bg-linear-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-xl font-semibold text-foreground">
            Page Not Found
          </h2>
        </div>
        <p className="text-muted-foreground/90 font-medium">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="mt-4 inline-block w-full">
          <Button
            variant={ButtonVariant.Primary}
            className="w-full rounded-xl h-11 text-[14px]"
          >
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
}
