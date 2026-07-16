import { Construction } from "lucide-react";

export function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-transparent w-full text-center px-4 relative overflow-hidden">
      <div className="w-16 h-16 bg-white shadow-sm text-blue-500 rounded-2xl flex items-center justify-center mb-5 border border-slate-200/60">
        <Construction className="w-8 h-8" strokeWidth={1.5} />
      </div>
      <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">
        {title}
      </h2>
      <p className="text-[13.5px] text-slate-500 mt-2 max-w-sm leading-relaxed">
        This section is currently under construction. Stay tuned for upcoming
        updates!
      </p>
    </div>
  );
}
