"use client";

import { CaretLeftIcon, CaretRightIcon, PlusIcon, MagnifyingGlassIcon, CalendarBlankIcon, ListBulletsIcon, RocketIcon } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/layout/page-header";
import { Input } from "@/components/ui/forms/input";
import { Select } from "@/components/ui/forms/select";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";

import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { useCalendarEvents } from "@/features/calendar/hooks/use-calendar-events";
import { CalendarTimetableGrid } from "./calendar-timetable-grid";
import { CalendarAgendaTab } from "./calendar-agenda-tab";
import { CalendarSprintTab } from "./calendar-sprint-tab";
import { CalendarEventModal } from "./calendar-event-modal";
import { CalendarDatePickerDialog } from "./calendar-date-picker-dialog";

const CALENDAR_MAIN_TABS: SegmentedControlTab[] = [
  { id: "Timetable", label: "Timetable Grid", icon: CalendarBlankIcon },
  { id: "Agenda", label: "Agenda List", icon: ListBulletsIcon },
  { id: "Sprint", label: "Sprint Milestones", icon: RocketIcon },
];

const CALENDAR_VIEW_TABS: SegmentedControlTab[] = [
  { id: "Day", label: "Day" },
  { id: "Week", label: "Week" },
  { id: "Month", label: "Month" },
  { id: "Year", label: "Year" },
];

export function CalendarView() {
  const {
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
  } = useCalendarEvents();

  const renderTabContent = () => {
    switch (activeTab) {
      case "Timetable":
        return (
          <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-2xl shadow-xs overflow-hidden">
            {/* Header Controls Bar */}
            <div className="p-3 sm:p-4 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    July 2026
                  </h3>
                  <button
                    onClick={() => setIsDatePickerOpen(true)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                    title="Choose Date"
                  >
                    <CalendarBlankIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-0.5 bg-secondary/80 rounded-lg p-0.5 border border-border/60">
                  <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer">
                    <CaretLeftIcon className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer">
                    <CaretRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Day / Week / Month / Year View Tabs */}
              <SegmentedControl
                tabs={CALENDAR_VIEW_TABS}
                activeTab={viewMode}
                onTabChange={(id) => setViewMode(id as typeof viewMode)}
              />
            </div>

            {/* Timetable Grid View */}
            <CalendarTimetableGrid
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          </div>
        );

      case "Agenda":
        return (
          <div className="flex-1 flex flex-col bg-card border border-border/80 rounded-2xl p-5 shadow-xs overflow-hidden">
            <CalendarAgendaTab
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          </div>
        );

      case "Sprint":
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <CalendarSprintTab />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* Page Header Area */}
      <div className="bg-transparent border-b border-border/60 shrink-0">
        <div className="w-full px-4 sm:px-6 md:px-8 pt-5">
          <PageHeader
            title="Calendar & Meetings"
            description="Manage your team meetings, daily standups, sprint reviews, and personal schedule."
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.Primary}
                  size={ButtonSize.Sm}
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  <PlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} /> New
                  Schedule
                </Button>
              </div>
            }
          >
            <div className="flex flex-col gap-4 mb-3">
              {/* Feature Tabs */}
              <SegmentedControl
                tabs={CALENDAR_MAIN_TABS}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder="Search meetings or attendees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-60 h-8 pl-8 pr-3 text-[12.5px]"
                  />
                </div>

                <Select
                  value={typeFilter}
                  onChange={setTypeFilter}
                  wrapperClassName="w-[160px]"
                  className="h-8 text-[12.5px]"
                >
                  <option value="all">All Event Types</option>
                  <option value="blue">Expos & Gala</option>
                  <option value="green">Workshops & Markets</option>
                  <option value="pink">Runway & Shows</option>
                  <option value="amber">Social & Fun</option>
                </Select>

                <Select
                  value={memberFilter}
                  onChange={setMemberFilter}
                  wrapperClassName="w-[140px]"
                  className="h-8 text-[12.5px]"
                >
                  <option value="all">All Attendees</option>
                  <option value="dat">Dat Ngo</option>
                  <option value="alex">Alex Rivers</option>
                  <option value="sam">Sam Lee</option>
                </Select>
              </div>
            </div>
          </PageHeader>
        </div>
      </div>

      {/* Main Content Area with Smooth Animation */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-5 flex overflow-hidden gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={TAB_CONTENT_VARIANTS}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Date Picker Dialog */}
      <CalendarDatePickerDialog
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
      />

      {/* Event Details Modal */}
      {selectedEvent && (
        <CalendarEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </PageContainer>
  );
}
