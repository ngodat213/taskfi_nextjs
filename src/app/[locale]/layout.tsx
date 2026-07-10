import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const googleSans = localFont({
  src: [
    {
      path: "../fonts/GoogleSansFlex_9pt-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GoogleSansFlex_9pt-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GoogleSansFlex_9pt-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/GoogleSansFlex_9pt-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-google-sans",
});

import "@/app/globals.css";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Obvious",
  description: "Join Obvious to manage your tasks efficiently.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${googleSans.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>{children}</QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
