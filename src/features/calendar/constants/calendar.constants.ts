export const CALENDAR_CONFIG = {
  START_HOUR: 8,
  ROW_HEIGHT_PX: 64,
  DEFAULT_SELECTED_DAY: 22,
} as const;

export const WEEK_DAYS = [
  { name: "Mon", date: 20 },
  { name: "Tue", date: 21 },
  { name: "Wed", date: 22, isToday: true },
  { name: "Thu", date: 23 },
  { name: "Fri", date: 24 },
  { name: "Sat", date: 25 },
  { name: "Sun", date: 26 },
];

export const TIME_SLOTS = [
  { hour: 8, label: "08:00" },
  { hour: 9, label: "09:00" },
  { hour: 10, label: "10:00" },
  { hour: 11, label: "11:00" },
  { hour: 12, label: "12:00" },
  { hour: 13, label: "13:00" },
  { hour: 14, label: "14:00" },
  { hour: 15, label: "15:00" },
  { hour: 16, label: "16:00" },
  { hour: 17, label: "17:00" },
  { hour: 18, label: "18:00" },
  { hour: 19, label: "19:00" },
  { hour: 20, label: "20:00" },
];

export const COLOR_STYLES = {
  blue: {
    card: "bg-[#edf5ff] dark:bg-[#1e293b]/90 border border-[#c7dffa] dark:border-blue-800/60 text-[#1d4ed8] dark:text-blue-200 shadow-2xs hover:border-[#93c5fd] hover:shadow-xs transition-all",
    badge:
      "bg-[#dbeafe] dark:bg-blue-500/20 text-[#1e40af] dark:text-blue-200 font-bold",
  },
  green: {
    card: "bg-[#edf9f0] dark:bg-[#064e3b]/90 border border-[#c6f0ce] dark:border-emerald-800/60 text-[#15803d] dark:text-emerald-200 shadow-2xs hover:border-[#86efac] hover:shadow-xs transition-all",
    badge:
      "bg-[#dcfce7] dark:bg-emerald-500/20 text-[#166534] dark:text-emerald-200 font-bold",
  },
  pink: {
    card: "bg-[#fdf0f5] dark:bg-[#881337]/90 border border-[#fbcfe8] dark:border-rose-800/60 text-[#be123c] dark:text-rose-200 shadow-2xs hover:border-[#f472b6] hover:shadow-xs transition-all",
    badge:
      "bg-[#fce7f3] dark:bg-rose-500/20 text-[#9f1239] dark:text-rose-200 font-bold",
  },
  amber: {
    card: "bg-[#fff7ed] dark:bg-[#78350f]/90 border border-[#ffedd5] dark:border-amber-800/60 text-[#c2410c] dark:text-amber-200 shadow-2xs hover:border-[#fdba74] hover:shadow-xs transition-all",
    badge:
      "bg-[#ffedd5] dark:bg-amber-500/20 text-[#9a3412] dark:text-amber-200 font-bold",
  },
  purple: {
    card: "bg-[#f5f3ff] dark:bg-[#581c87]/90 border border-[#ddd6fe] dark:border-purple-800/60 text-[#6b21a8] dark:text-purple-200 shadow-2xs hover:border-[#c084fc] hover:shadow-xs transition-all",
    badge:
      "bg-[#ede9fe] dark:bg-purple-500/20 text-[#581c87] dark:text-purple-200 font-bold",
  },
};
