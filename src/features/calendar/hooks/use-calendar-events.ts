"use client";

import { useMemo, useState } from "react";

import { MOCK_CALENDAR_EVENTS } from "@/features/calendar/mocks/calendar.mocks";
import {
  CalendarEvent,
  CalendarEventAttendee,
  CalendarViewMode,
} from "@/features/calendar/types/calendar.types";

export function useCalendarEvents() {
  const [activeTab, setActiveTab] = useState("Timetable");
  const [viewMode, setViewMode] = useState<CalendarViewMode>("Week");
  const [selectedDay, setSelectedDay] = useState<number>(22);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Search & Filter state with explicit naming
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");

  // Selected event state for modal
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );

  // Computed filtered events list
  const filteredEvents = useMemo(() => {
    return MOCK_CALENDAR_EVENTS.filter((evt: CalendarEvent) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.attendees.some((a: CalendarEventAttendee) =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesType = typeFilter === "all" || evt.color === typeFilter;

      const matchesMember =
        memberFilter === "all" ||
        evt.attendees.some(
          (a: CalendarEventAttendee) =>
            (memberFilter === "dat" && a.name.includes("Dat")) ||
            (memberFilter === "alex" && a.name.includes("Alex")) ||
            (memberFilter === "sam" && a.name.includes("Sam")),
        );

      return matchesSearch && matchesType && matchesMember;
    });
  }, [searchQuery, typeFilter, memberFilter]);

  return {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    selectedDay,
    setSelectedDay,
    isDatePickerOpen,
    setIsDatePickerOpen,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    memberFilter,
    setMemberFilter,
    selectedEvent,
    setSelectedEvent,
    filteredEvents,
  };
}
