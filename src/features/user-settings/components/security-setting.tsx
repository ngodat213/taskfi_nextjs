import { Button } from "@/components/ui/actions/button";

export function SecuritySetting() {
  return (
    <div className="space-y-5 w-full max-w-5xl">
      {/* Change Password Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900">
              Change your password
            </h3>
            <p className="text-[13px] text-slate-500 mt-1">
              You can change your current password for your account.
            </p>
          </div>
          <Button className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-[13px] h-9 px-4 rounded-md shrink-0 shadow-sm transition-colors">
            Change password
          </Button>
        </div>
      </div>

      {/* Delete Account Card */}
      <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden bg-red-50/30">
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <h3 className="text-[14px] font-semibold text-red-700">
              Delete account
            </h3>
            <p className="text-[13px] text-red-600/80 mt-1">
              This action is irreversible, and all information associated with
              your account will be permanently deleted.
            </p>
          </div>
          <Button className="bg-red-600 text-white hover:bg-red-700 text-[13px] h-9 px-4 rounded-md shrink-0 shadow-sm font-medium transition-colors">
            Delete my account
          </Button>
        </div>
      </div>
    </div>
  );
}
