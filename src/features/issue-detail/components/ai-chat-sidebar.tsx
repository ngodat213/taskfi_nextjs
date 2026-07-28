import {
  SidebarSimpleIcon,
  CornersOutIcon,
  FileTextIcon,
  CaretDownIcon,
  CheckIcon,
  CaretRightIcon,
  ArrowDownIcon,
  PlusIcon,
  AtIcon,
  MicrophoneIcon,
  SquareIcon,
  FadersIcon,
  ArrowUpIcon,
} from "@phosphor-icons/react";
export function AiChatSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-90 xl:w-105 shrink-0 bg-transparent p-6 lg:p-8 lg:pr-2 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/60 shrink-0">
        <div className="flex items-center gap-2 text-muted-foreground">
          <SidebarSimpleIcon className="w-4 h-4" />
          <span className="text-[13px] font-semibold">Q1 Report • 1</span>
        </div>
        <button className="text-muted-foreground hover:text-slate-600">
          <CornersOutIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-5 custom-scrollbar relative">
        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-secondary" />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Wednesday
          </span>
          <div className="flex-1 h-px bg-secondary" />
        </div>

        {/* User Message */}
        <div className="flex flex-col items-end gap-1">
          <div className="bg-muted/80 text-foreground text-[13.5px] p-4 rounded-[20px] rounded-tr-sm max-w-[90%] leading-relaxed relative overflow-hidden">
            <p className="mb-4">Create a Folio for me with these settings:</p>
            <ul className="space-y-1.5 ml-2">
              <li>- Folio Type: Report</li>
              <li>- Design Style: Modern/Digital</li>
              <li>- Include Charts: Yes</li>
              <li>- Include AI Images: Yes</li>
              <li>
                - Data Sources: @
                <span className="bg-card px-1 py-0.5 rounded shadow-sm text-[12px] inline-flex items-center gap-1">
                  <FileTextIcon className="w-3 h-3 text-muted-foreground" /> Q1
                  Overview...
                </span>
              </li>
            </ul>
            {/* Gradient fade and Show more */}
            <div className="absolute bottom-0 left-0 right-0 pt-8 pb-2 bg-linear-to-t from-muted via-muted/90 to-transparent flex justify-center">
              <button className="text-[11px] font-medium text-foreground/70 flex items-center gap-1 hover:text-foreground">
                Show more <CaretDownIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium mr-1">
            7:52 PM
          </span>
        </div>

        {/* AI Message Stream */}
        <div className="flex flex-col gap-4 max-w-[90%]">
          {/* Block 1 */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
              <CheckIcon className="w-3 h-3 text-muted-foreground" />
              Wrapped up 2 actions
              <CaretRightIcon className="w-3 h-3 text-muted-foreground" />
            </button>
            <p className="text-[13.5px] text-foreground leading-relaxed">
              Now let me read all the required component files and the Q1
              Overview document simultaneously.
            </p>
          </div>

          {/* Block 2 */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
              <CheckIcon className="w-3 h-3 text-muted-foreground" />
              Ran through 5 things
              <CaretRightIcon className="w-3 h-3 text-muted-foreground" />
            </button>
            <p className="text-[13.5px] text-foreground leading-relaxed">
              Now let me read the charts and images component files, then
              generate the AI image in parallel.
            </p>
          </div>

          {/* Block 3 */}
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
              <CheckIcon className="w-3 h-3 text-muted-foreground" />
              Knocked out 4 tasks
              <CaretRightIcon className="w-3 h-3 text-muted-foreground" />
            </button>
            <p className="text-[13.5px] text-foreground leading-relaxed">
              All components loaded. Now let me generate the AI image and get
              the API endpoint simultaneously.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      <div className="absolute bottom-25 left-1/2 -translate-x-1/2 flex justify-center z-10">
        <button className="bg-card border border-border/60 shadow-sm rounded-full p-1.5 text-muted-foreground hover:text-slate-600 transition-colors">
          <ArrowDownIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Input Area */}
      <div className="pt-2 shrink-0 bg-transparent">
        <div className="border border-border/80 rounded-3xl bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-200/50 focus-within:border-slate-300 transition-all">
          <textarea
            placeholder="What should we work on?"
            className="w-full bg-transparent text-[14px] text-foreground placeholder:text-slate-400 px-3 py-2 min-h-11 max-h-30 resize-none focus:outline-none"
            rows={1}
          />

          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition-colors">
                <PlusIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition-colors">
                <AtIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition-colors">
                <MicrophoneIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition-colors">
                <SquareIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                Auto <CaretDownIcon className="w-3 h-3" />
              </button>
              <button className="p-1.5 text-muted-foreground hover:text-slate-600 rounded-lg hover:bg-muted transition-colors">
                <FadersIcon className="w-4 h-4" />
              </button>
              <button className="bg-border text-white rounded-full p-1.5 ml-1 transition-colors hover:bg-slate-300">
                <ArrowUpIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
