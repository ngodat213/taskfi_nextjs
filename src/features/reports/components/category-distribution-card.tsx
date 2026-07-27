"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  CategoryBreakdown,
  SprintHistoryItem,
} from "@/features/reports/types/reports.types";

const DONUT_COLORS = [
  "#3b82f6", // Vivid Blue
  "#10b981", // Emerald Green
  "#8b5cf6", // Purple
  "#0ea5e9", // Sky Blue
  "#94a3b8", // Slate Gray
];

interface WorkBreakdownCardProps {
  categories: CategoryBreakdown[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      color: string;
      category?: string;
      name?: string;
      value: number;
      percentage: number;
    };
  }>;
}

const CustomDonutTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover/95 backdrop-blur-md border border-border/80 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-[12.5px] font-medium text-foreground">
        <span
          className="w-2.5 h-1 rounded-full shrink-0"
          style={{ backgroundColor: data.color }}
        />
        <span>{data.name || data.category}</span>
        <span className="font-bold ml-1">{data.percentage}%</span>
      </div>
    );
  }
  return null;
};

export function WorkBreakdownCard({ categories }: WorkBreakdownCardProps) {
  const pieData = categories.map((cat, index) => ({
    name: cat.category,
    value: cat.points,
    color: DONUT_COLORS[index % DONUT_COLORS.length],
    percentage: cat.percentage,
  }));

  const totalPoints = categories.reduce((sum, c) => sum + c.points, 0);

  return (
    <div className="bg-card border border-border/80 hover:border-primary/50 rounded-2xl p-3.5 shadow-2xs hover:shadow-md backdrop-blur-xs transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[13.5px] font-bold text-foreground tracking-tight">
          Work Breakdown by Category
        </h4>
      </div>

      {/* Donut Chart Centered */}
      <div className="w-full h-52.5 relative flex items-center justify-center pt-1">
        {/* Center Floating Circle (z-0) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-27 h-27 rounded-full bg-card shadow-md border border-border/40 flex flex-col items-center justify-center text-center p-1">
            <span className="text-[12px] font-medium text-muted-foreground leading-tight">
              Tổng điểm
            </span>
            <span className="text-[19px] font-bold text-foreground leading-tight mt-0.5">
              {totalPoints} pts
            </span>
          </div>
        </div>

        {/* SVG Chart Layer (z-10) */}
        <div className="w-full h-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ outline: "none" }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={0}
                dataKey="value"
                tabIndex={-1}
                style={{ outline: "none" }}
                stroke="var(--color-card)"
                strokeWidth={1.5}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomDonutTooltip />}
                wrapperStyle={{ zIndex: 50, outline: "none" }}
                allowEscapeViewBox={{ x: true, y: true }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

interface VelocityGrowthCardProps {
  sprintHistory: SprintHistoryItem[];
}

export function VelocityGrowthCard({ sprintHistory }: VelocityGrowthCardProps) {
  const barData = sprintHistory.map((sh) => ({
    name: sh.sprintName,
    completed: sh.completedPoints,
    commitment: sh.committedPoints,
  }));

  return (
    <div className="bg-card border border-border/80 hover:border-primary/50 rounded-2xl p-3.5 shadow-2xs hover:shadow-md backdrop-blur-xs transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[13.5px] font-bold text-foreground tracking-tight">
          Velocity Growth Across Sprints
        </h4>
      </div>

      {/* Bar Chart */}
      <div className="w-full h-52.5 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            style={{ outline: "none" }}
          >
            <CartesianGrid
              vertical={false}
              stroke="var(--color-border)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
                fontWeight: 500,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize: 11,
                fill: "var(--color-muted-foreground)",
                fontWeight: 500,
              }}
            />
            <Tooltip
              cursor={{ fill: "var(--color-secondary)", opacity: 0.4 }}
              formatter={(val) => [`${val ?? 0} pts`, "Points"]}
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                borderColor: "var(--color-border)",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "var(--color-foreground)",
              }}
            />
            <Bar
              dataKey="completed"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface CategoryDistributionCardProps {
  categories: CategoryBreakdown[];
  sprintHistory: SprintHistoryItem[];
}

export function CategoryDistributionCard({
  categories,
  sprintHistory,
}: CategoryDistributionCardProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <WorkBreakdownCard categories={categories} />
      <VelocityGrowthCard sprintHistory={sprintHistory} />
    </div>
  );
}
