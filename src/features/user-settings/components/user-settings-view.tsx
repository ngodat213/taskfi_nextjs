"use client";
import { UserIcon, ShieldIcon, FadersIcon } from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";

import { UserSettingsTab } from "@/features/user-settings/enums/user-settings.enum";
import { ProfileSetting } from "./profile-setting";
import { PreferencesSetting } from "./preferences-setting";
import { SecuritySetting } from "./security-setting";
import { PageContainer } from "@/components/layout/page-container";

export function UserSettingsView() {
  const t = useTranslations("UserSettings");
  const TK = TRANSLATION_KEYS.USER_SETTINGS;
  const [activeTab, setActiveTab] = useState<string>(UserSettingsTab.PROFILE);

  const tabs = [
    {
      id: UserSettingsTab.PROFILE,
      label: t(TK.tabs.profile),
      icon: UserIcon,
    },
    {
      id: UserSettingsTab.PREFERENCES,
      label: t(TK.tabs.preferences),
      icon: FadersIcon,
    },
    {
      id: UserSettingsTab.SECURITY,
      label: t(TK.tabs.security),
      icon: ShieldIcon,
    },
  ];

  return (
    <PageContainer>
      {/* Main Container */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-12">
        <PageHeader
          className="mb-6 max-w-5xl"
          title={t("title")}
          description={t("description")}
        >
          <div className="overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 w-full">
            <SegmentedControl
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="min-w-fit shadow-sm bg-card border border-border/60"
            />
          </div>
        </PageHeader>

        <div className="w-full">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              variants={TAB_CONTENT_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {activeTab === UserSettingsTab.PROFILE && <ProfileSetting />}
              {activeTab === UserSettingsTab.PREFERENCES && (
                <PreferencesSetting />
              )}
              {activeTab === UserSettingsTab.SECURITY && <SecuritySetting />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
