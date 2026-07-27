"use client";

import {
  Copy,
  Check,
  Camera,
  User,
  EnvelopeSimple,
  IdentificationCard,
  ShieldCheck,
  Trash,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/user.store";
import { getInitials } from "@/utils/string";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { Input } from "@/components/ui/forms/input";
import { cn } from "@/utils/cn";

export function ProfileSetting() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [fullName, setFullName] = useState(user?.name || "Sam Lee");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const userId = user?.id || "usr_c7c93da5-5b20-4a0c-9745-34f0b3e08f00";
  const userEmail = user?.email || "alexsmith.mobbin+1@gmail.com";

  const handleSaveName = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      if (user) {
        setUser({ ...user, name: fullName });
      }
      setTimeout(() => setIsSaved(false), 2500);
    }, 400);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl">
      {/* Profile Picture Card */}
      <div className="relative bg-card rounded-2xl border border-border/80 p-6 shadow-2xs overflow-hidden group">
        {/* Subtle Ambient Background Radial Glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent pointer-events-none blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Container */}
            <div className="relative group/avatar cursor-pointer shrink-0">
              <div className="w-20 h-20 rounded-full bg-emerald-500 text-white font-bold text-2xl flex items-center justify-center border-2 border-card shadow-md relative overflow-hidden transition-transform duration-300 group-hover/avatar:scale-105">
                {getInitials(fullName)}

                {/* Camera Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Online Status Indicator */}
              <span
                className="w-4.5 h-4.5 bg-emerald-500 ring-3 ring-card rounded-full absolute bottom-0.5 right-0.5 shadow-2xs"
                title="Active Now"
              />
            </div>

            {/* Profile Info Summary */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-foreground tracking-tight">
                  {fullName}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-[13px] text-muted-foreground font-medium">
                {userEmail}
              </p>
              <p className="text-[11.5px] text-muted-foreground/80">
                PNG, JPG or WEBP under 5MB. Recommended 400x400px.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <Button
              variant={ButtonVariant.Pill}
              size={ButtonSize.Sm}
              className="flex-1 sm:flex-initial h-9 px-4 rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold text-[13px] shadow-2xs"
            >
              Upload new photo
            </Button>
            <Button
              variant={ButtonVariant.Outline}
              size={ButtonSize.Sm}
              className="h-9 px-3 rounded-full border-border/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              title="Remove avatar"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Basic Profile Details Card */}
      <div className="relative bg-card rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
        {/* Card Header */}
        <div className="p-5 sm:p-6 border-b border-border/60 flex items-center justify-between gap-4 bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-2xs shrink-0">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-foreground tracking-tight">
                Basic profile details
              </h3>
              <p className="text-[12.5px] text-muted-foreground font-medium mt-0.5">
                Manage your personal identity, email address, and account
                credentials
              </p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-6 items-start">
            <div>
              <label className="text-[13.5px] font-bold text-foreground">
                Full name
              </label>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                Your display name as it appears across workspaces, issues, and
                comments.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-9.5 px-4 rounded-full text-[13px] font-medium bg-secondary/40 focus:bg-background border-border/80"
                placeholder="Enter your full name"
              />
              <Button
                variant={ButtonVariant.Pill}
                size={ButtonSize.Sm}
                onClick={handleSaveName}
                disabled={isSaving}
                className={cn(
                  "h-9.5 px-5 rounded-full font-bold text-[12.5px] transition-all shrink-0 cursor-pointer shadow-2xs",
                  isSaved
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : isSaved ? (
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                    Saved!
                  </span>
                ) : (
                  <span>Save changes</span>
                )}
              </Button>
            </div>
          </div>

          <div className="h-px bg-border/50 w-full" />

          {/* Email Address Row */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-6 items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <label className="text-[13.5px] font-bold text-foreground">
                  Email address
                </label>
                <EnvelopeSimple className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                Primary email associated with your TaskFi account and security
                notifications.
              </p>
            </div>
            <div className="flex items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <Input
                  type="email"
                  value={userEmail}
                  readOnly
                  disabled
                  className="h-9.5 px-4 pr-24 rounded-full text-[13px] font-medium bg-muted/60 text-muted-foreground border-border/60 cursor-not-allowed"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                  Primary
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-border/50 w-full" />

          {/* User ID Row */}
          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-6 items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <label className="text-[13.5px] font-bold text-foreground">
                  Unique User ID
                </label>
                <IdentificationCard className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed font-medium">
                Unique system UUID used for API integration, mentions, and
                integrations.
              </p>
            </div>
            <div className="flex items-center gap-3 max-w-xl">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={userId}
                  readOnly
                  disabled
                  className="h-9.5 px-4 pr-11 rounded-full text-[12.5px] font-mono bg-muted/60 text-muted-foreground border-border/60 cursor-not-allowed"
                />
                <button
                  onClick={handleCopyId}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7.5 h-7.5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                  title="Copy User ID"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Check
                          className="w-4 h-4 text-emerald-500"
                          strokeWidth={2.5}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>

              {isCopied && (
                <span className="text-[12px] font-bold text-emerald-500 animate-in fade-in zoom-in-95 duration-150">
                  Copied!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
