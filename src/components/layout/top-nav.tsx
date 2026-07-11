import { Bell, HelpCircle, Settings, Search, Menu } from "lucide-react";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-[56px] w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 flex-shrink-0 z-30 sticky top-0">
      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 rounded-lg transition-colors"
        >
          <Menu className="w-[20px] h-[20px]" />
        </button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative group hidden lg:block mr-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-[200px] h-8 pl-8 pr-3 bg-slate-100/50 border border-transparent rounded-lg text-[13px] text-slate-700 placeholder:text-slate-500 focus:outline-none focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all hover:bg-slate-100"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors">
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white text-[12px] font-bold ml-2 cursor-pointer hover:opacity-90 transition-opacity">
          TN
        </div>
      </div>
    </header>
  );
}
