import { useTranslations } from "next-intl";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { Select } from "@/components/ui/forms/select";

export function PreferencesSetting() {
  const t = useTranslations("UserSettings");
  const TK = TRANSLATION_KEYS.USER_SETTINGS.preferences;

  return (
    <div className="space-y-5 w-full max-w-5xl">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-[14px] font-semibold text-foreground">
            {t(TK.title)}
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">{t(TK.subtitle)}</p>
        </div>

        <div className="p-5 space-y-6">
          {/* Theme Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-foreground">
                {t(TK.theme)}
              </label>
              <p className="text-[12px] text-muted-foreground mt-1">
                Customize the appearance of your application.
              </p>
            </div>
            <div className="w-full max-w-md">
              <Select
                value="light"
                onChange={() => {}}
                placeholder="Select theme"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="system">System Default</option>
              </Select>
            </div>
          </div>

          <div className="h-px bg-secondary w-full" />

          {/* Language Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-foreground">
                {t(TK.language)}
              </label>
              <p className="text-[12px] text-muted-foreground mt-1">
                Choose the language used in the user interface.
              </p>
            </div>
            <div className="w-full max-w-md">
              <Select
                value="en"
                onChange={() => {}}
                placeholder="Select language"
              >
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
