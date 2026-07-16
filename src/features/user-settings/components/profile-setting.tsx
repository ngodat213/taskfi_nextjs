import { Button } from "@/components/ui/actions/button";
import { Copy } from "lucide-react";

export function ProfileSetting() {
  return (
    <div className="space-y-5 w-full max-w-5xl">
      {/* Profile Picture Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5">
          <h3 className="text-[14px] font-semibold text-slate-900">
            Profile picture
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            Manage your profile picture
          </p>

          <div className="mt-5 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-medium text-slate-600">
              A
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-fit bg-slate-900 text-white hover:bg-slate-800 text-[13px] h-8 px-4 rounded-md shadow-sm">
                Upload picture
              </Button>
              <p className="text-[12px] text-slate-500">PNG, JPEG under 2MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Profile Details Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-[14px] font-semibold text-slate-900">
            Basic profile details
          </h3>
          <p className="text-[13px] text-slate-500 mt-1">
            Manage your basic profile details
          </p>
        </div>

        <div className="p-5 space-y-6">
          {/* Full Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-slate-900">
                Full name
              </label>
              <p className="text-[12px] text-slate-500 mt-1">
                This is your full name as it will appear on your profile.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="flex-1 max-w-md h-9 rounded-md border border-slate-300 px-3 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                defaultValue="Sam Lee"
              />
              <Button className="bg-slate-900 text-white hover:bg-slate-800 text-[13px] h-9 px-4 rounded-md shadow-sm shrink-0">
                Save
              </Button>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-slate-900">
                Email address
              </label>
              <p className="text-[12px] text-slate-500 mt-1">
                This is your profile email.
              </p>
            </div>
            <div className="w-full max-w-md">
              <input
                type="email"
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-[13px] bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
                defaultValue="alexsmith.mobbin+1@gmail.com"
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* User ID Row */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-5">
            <div>
              <label className="text-[13px] font-medium text-slate-900">
                User ID
              </label>
              <p className="text-[12px] text-slate-500 mt-1">
                This is your unique user identifier.
              </p>
            </div>
            <div className="w-full max-w-md">
              <div className="relative">
                <input
                  type="text"
                  className="w-full h-9 rounded-md border border-slate-200 pl-3 pr-9 text-[13px] bg-slate-50 text-slate-500 focus:outline-none cursor-not-allowed"
                  defaultValue="c7c93da5-5b20-4a0c-9745-34f0b3e08f00"
                  readOnly
                  disabled
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors">
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
