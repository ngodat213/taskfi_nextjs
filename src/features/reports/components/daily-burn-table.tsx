"use client";

import { BurndownPoint } from "@/features/reports/types/reports.types";
import { cn } from "@/utils/cn";
import { CalendarIcon, PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/data-display/table";

interface DailyBurnTableProps {
  data: BurndownPoint[];
}

export function DailyBurnTable({ data }: DailyBurnTableProps) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[13.5px] font-bold text-foreground tracking-tight">
        Daily Story Points Burn Rate & Scope Log
      </h4>

      {/* Table using shared UI component */}
      <div className="w-full overflow-hidden rounded-xl border border-border/80 hover:border-primary/50 backdrop-blur-xs transition-all duration-200 shadow-2xs hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3.5 py-2.5">Sprint Day</TableHead>
              <TableHead className="px-3.5 py-2.5">Date</TableHead>
              <TableHead className="px-3.5 py-2.5 text-right">
                Ideal Target
              </TableHead>
              <TableHead className="px-3.5 py-2.5 text-right">
                Actual Remaining
              </TableHead>
              <TableHead className="px-3.5 py-2.5 text-right">
                Points Burned
              </TableHead>
              <TableHead className="px-3.5 py-2.5 text-center">
                Scope Change
              </TableHead>
              <TableHead className="px-3.5 py-2.5 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[12.5px] font-medium">
            {data.map((pt, idx) => {
              const isToday = idx === 7;
              const isPastOrToday = idx <= 7;
              const diff = pt.idealRemaining - pt.actualRemaining;

              return (
                <TableRow
                  key={pt.day}
                  className={cn(
                    "transition-colors hover:bg-secondary/60",
                    isToday && "bg-blue-500/10 font-bold",
                  )}
                >
                  <TableCell className="px-3.5 py-2.5 flex items-center gap-2 text-foreground font-semibold">
                    <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{pt.day}</span>
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-muted-foreground">
                    {pt.date}
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-right text-muted-foreground font-semibold">
                    {pt.idealRemaining} pts
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-right text-foreground font-bold">
                    {isPastOrToday ? `${pt.actualRemaining} pts` : "—"}
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-right text-blue-600 dark:text-blue-400 font-bold">
                    {isPastOrToday && pt.completedPoints > 0
                      ? `+${pt.completedPoints} pts`
                      : "—"}
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-center">
                    {pt.scopeAdded > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <PlusCircleIcon className="w-3 h-3" />+{pt.scopeAdded} pts
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60 text-[11px]">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3.5 py-2.5 text-right">
                    {isPastOrToday ? (
                      diff >= 0 ? (
                        <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          {diff === 0 ? "On Target" : `Ahead +${diff}pts`}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                          Behind {Math.abs(diff)}pts
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground text-[11px]">
                        Upcoming
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
