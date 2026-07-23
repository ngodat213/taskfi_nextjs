export interface CalendarEventAttendee {
  name: string;
  avatarBg: string;
  role?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  dayIndex: number; // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  dayDate: number;
  startHour: number; // e.g. 9.5 = 09:30 AM
  durationHours: number; // e.g. 1.5 hours
  startTimeStr: string;
  endTimeStr: string;
  color: "blue" | "green" | "pink" | "amber" | "purple";
  meetingUrl?: string;
  agenda: string[];
  attendees: CalendarEventAttendee[];
}

export type CalendarViewMode = "Day" | "Week" | "Month" | "Year";
