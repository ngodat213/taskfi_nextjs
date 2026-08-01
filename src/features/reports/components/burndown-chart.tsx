"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { BurndownPoint } from "@/features/reports/types/reports.types";
import { cn } from "@/utils/cn";

interface BurndownChartProps {
  data: BurndownPoint[];
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload: BurndownPoint;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0]?.payload;
  const actual = dataPoint?.actualRemaining;
  const ideal = dataPoint?.idealRemaining;
  const diff = ideal !== undefined && actual !== undefined ? ideal - actual : 0;

  return (
    <div className="bg-popover/95 border border-border/80 rounded-xl p-3.5 shadow-xl text-[12px] flex flex-col gap-2 min-w-42.5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5 font-bold">
        <span className="text-foreground">{label}</span>
        <span className="text-[11px] text-muted-foreground">
          {dataPoint?.date}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 font-medium">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Actual Remaining:
          </span>
          <span className="font-bold text-foreground">{actual} pts</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Ideal Baseline:
          </span>
          <span className="font-bold text-foreground">{ideal} pts</span>
        </div>
      </div>

      <div className="pt-1.5 border-t border-border/40 flex items-center justify-between text-[11px] font-bold">
        <span className="text-muted-foreground">Pace:</span>
        {diff >= 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400">
            Ahead by {diff} pts
          </span>
        ) : (
          <span className="text-amber-500">Behind by {Math.abs(diff)} pts</span>
        )}
      </div>
    </div>
  );
}

export function BurndownChart({ data, className }: BurndownChartProps) {
  const chartData = data.map((d, index) => ({
    ...d,
    actualRemainingFormatted: index <= 7 ? d.actualRemaining : undefined,
  }));

  return (
    <div
      className={cn(
        "bg-card border border-border/80 hover:border-primary/50 rounded-2xl p-3.5 shadow-2xs hover:shadow-md backdrop-blur-xs transition-all duration-200 flex flex-col gap-3 relative overflow-hidden",
        className,
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h4 className="text-[13.5px] font-bold text-foreground tracking-tight">
          Sprint 24 Burndown Trend
        </h4>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-52.5 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            style={{ outline: "none" }}
          >
            <defs>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-border)"
              strokeOpacity={0.5}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
                fontWeight: 500,
              }}
              dy={5}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
                fontWeight: 500,
              }}
              domain={[0, 80]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#3b82f6",
                strokeWidth: 1,
                strokeDasharray: "3 3",
              }}
            />

            {/* Ideal Target Dashed Line */}
            <Line
              type="monotone"
              dataKey="idealRemaining"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />

            {/* Actual Remaining Area Curve */}
            <Area
              type="monotone"
              dataKey="actualRemainingFormatted"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#actualGradient)"
              dot={{
                r: 4,
                fill: "#3b82f6",
                stroke: "var(--color-card)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#3b82f6",
                stroke: "var(--color-card)",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Legend Row */}
      <div className="flex items-center justify-center gap-4 pt-1 text-[11.5px] text-muted-foreground font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-slate-400 rounded-full" />
          <span>Ideal Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="font-semibold text-foreground">Actual Burn</span>
        </div>
      </div>
    </div>
  );
}
