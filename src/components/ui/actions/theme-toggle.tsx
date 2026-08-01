"use client";
import { useTheme } from "next-themes";

import { MoonIcon, SunIcon } from "@phosphor-icons/react/dist/ssr";

import {
  Button,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/actions/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={ButtonVariant.Outline}
      size={ButtonSize.Sm}
      className="w-9 h-9 p-0 flex items-center justify-center rounded-md"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
