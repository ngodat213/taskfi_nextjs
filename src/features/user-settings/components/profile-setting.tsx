import { Button } from "@/components/ui/actions/button";
import { Copy } from "lucide-react";

export function ProfileSetting() {
  return (
    <div className="space-y-5 w-full max-w-5xl">
      {/* Profile Picture Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5">
          <h3 className="text-[14px] font-semibold text-foreground">
            Profile picture
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage your profile picture
          </p>

          <div className="mt-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-secondary border border-border flex items-center justify-center text-xl font-medium text-muted-foreground">
              A
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-fit bg-slate-900 text-white hover:bg-slate-800 text-[13px] h-8 px-4 rounded-md shadow-sm">
                Upload picture
              </Button>
              <p className="text-[12px] text-muted-foreground">PNG, JPEG under 2MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Profile Details Card */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-[14px] font-semibold text-foreground">
            Basic profile details
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Manage your basic profile details
          </p>
        </div>

        <div className="p-5 space-y-6">
          {/* Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-foreground">
                Full name
              </label>
              <p className="text-[12px] text-muted-foreground mt-1">
                This is your full name as it will appear on your profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="flex-1 max-w-md h-9 rounded-md border border-border px-3 text-[13px] text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                defaultValue="Sam Lee"
              />
              <Button className="bg-slate-900 text-white hover:bg-slate-800 text-[13px] h-9 px-4 rounded-md shadow-sm shrink-0">
                Save
              </Button>
            </div>
          </div>

          <div className="h-px bg-secondary w-full" />

          {/* Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-foreground">
                Email address
              </label>
              <p className="text-[12px] text-muted-foreground mt-1">
                This is your profile email.
              </p>
            </div>
            <div className="w-full max-w-md">
              <input
                type="email"
                className="w-full h-9 rounded-md border border-border px-3 text-[13px] bg-muted text-muted-foreground focus:outline-none cursor-not-allowed"
                defaultValue="alexsmith.mobbin+1@gmail.com"
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="h-px bg-secondary w-full" />

          {/* User ID Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-foreground">
                User ID
              </label>
              <p className="text-[12px] text-muted-foreground mt-1">
                This is your unique user identifier.
              </p>
            </div>
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-9 rounded-md border border-border pl-3 pr-9 text-[13px] bg-muted text-muted-foreground focus:outline-none cursor-not-allowed"
                  defaultValue="c7c93da5-5b20-4a0c-9745-34f0b3e08f00"
                  readOnly
                  disabled
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
