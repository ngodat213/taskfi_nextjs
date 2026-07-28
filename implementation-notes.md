# Implementation Notes

## Summary of Recent Changes

1. **Fix Synchronous `setState` inside `useEffect` ([issue-summary-input.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-summary-input.tsx))**:
   - Replaced synchronous `setState` inside `useEffect` with React's recommended render-phase state adjustment pattern (`if (initialSummary !== prevInitialSummary)`), preventing cascading re-renders.

2. **Clean Code & DRY Refactoring for `IssueSubtasks` ([issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx))**:
   - Reused existing `<IssueItemCard />` component to eliminate ~40 lines of duplicate subtask item JSX.
   - Extracted `handleAddSubtask` helper function to flatten inline callbacks in `SearchSelect`.

3. **Unified Box Container Styling for Linked Issues ([issue-linked-issues.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-linked-issues.tsx), [issue-item-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-item-card.tsx))**:
   - Wrapped `Linked Issues` list inside identical container box styling (`className="flex flex-col gap-1.5 p-2 bg-muted/50 rounded-xl border border-border/60"`) matching `IssueSubtasks`.
   - Enhanced shared `<IssueItemCard />` styling with hover state, smooth transitions, and optional `className` support.

4. **Remove Unused Dead Code (`link-issue-modal.tsx`)**:
   - Deleted unused legacy component `link-issue-modal.tsx` since issue linking is managed directly inline within `IssueLinkedIssues`.

5. **Expand and Integrate `issue-detail.schema.ts` Schema**:
   - Extended [issue-detail.schema.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/schemas/issue-detail.schema.ts) to define a complete `updateIssueSchema` Zod validation schema covering all issue fields.
   - Integrated `updateIssueSchema.safeParse` into `handleUpdate` inside [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx) for instant client-side field validation prior to triggering update API mutations.

6. **Fix `useTranslations("Dashboard")` Namespace for Issue Detail View Components ([translations.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/constants/translations.ts), [en.json](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/messages/en.json), [vi.json](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/messages/vi.json), [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx), [issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx), [issue-linked-issues.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-linked-issues.tsx))**:
   - Passed `"Dashboard"` namespace argument to `useTranslations("Dashboard")` in `IssueDetailView`, `IssueSubtasks`, and `IssueLinkedIssues`.
   - Fixed un-translated fallback raw key strings (`ISSUESUBTASKS.TITLE`, `IssueSubtasks.placeholder`, `ISSUELINKEDISSUES.TITLE`, etc.) so `next-intl` correctly resolves translations from `messages/en.json` and `messages/vi.json`.

7. **Complete 100% i18n Translation for `IssueMainContent` & `IssueProperties` ([issue-main-content.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-main-content.tsx), [issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
   - Added translation keys under `TRANSLATION_KEYS.DASHBOARD.IssueMainContent` and `IssueProperties`.
   - Replaced all remaining hardcoded English text strings (`Parent Task`, `Add Parent Task`, `Description`, `Add a description...`, `Comments`, `Type`, `Status`, `Priority`, `Select priority...`, `Assignee`, `Assign to me`, `Unassigned`, `Reporter`, `Story Points`, `Sprint`, `Due Date`, `Activity`) with `useTranslations("Dashboard")` calls `t(TK.key)`.

8. **Modular Extraction of `StoryPointsSelector` Component ([story-points-selector.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/story-points-selector.tsx), [issue-detail.constants.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/constants/issue-detail.constants.ts), [issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
   - Extracted `STORY_POINT_OPTIONS` constant into `src/features/issue-detail/constants/issue-detail.constants.ts`.
   - Created reusable `<StoryPointsSelector />` component under `src/features/issue-detail/components/story-points-selector.tsx` adhering to Clean Code & Single Responsibility principles.
   - Refactored `IssueProperties` to render `<StoryPointsSelector />`, simplifying parent component JSX.

9. **Custom Shared Reusable `DatePicker` Component ([date-picker.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/date-picker.tsx), [issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx), [create-task-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/create-task-modal.tsx))**:
   - Created modern reusable `<DatePicker />` component with custom Calendar Popover, Month/Year navigation controls, Quick Date Presets (`Today`, `Tomorrow`, `Next Week`), clear `X` button, and outside-click dismissal.
   - Replaced native HTML `<input type="date">` tags across `IssueProperties` and `CreateTaskModal` with `<DatePicker />` for an ultra-premium UX.

10. **Fix IDE Linter Warnings & React Cascading Render Errors ([date-picker.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/date-picker.tsx), [create-task-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/create-task-modal.tsx))**:
    - Replaced `useEffect` with render-phase state adjustment pattern (`if (value !== prevValue)`) in `DatePicker`, resolving `setState` inside `useEffect` cascading re-render error.
    - Cleaned up unused `register` variable in `CreateTaskModal`.

11. **Fix `IssueItemCard` Full-Width Expansion ([issue-item-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-item-card.tsx), [issue-main-content.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-main-content.tsx))**:
    - Added `w-full` class to `IssueItemCard` default styling so item cards stretch to fill 100% of container width.
    - Removed `items-start` alignment class from Parent Task container in `IssueMainContent` so children stretch horizontally by default.

12. **Fix Due Date Instant Cache Update & Fallback Prop ([use-issues.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/hooks/use-issues.ts), [issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
    - Extended `onMutate` optimistic query cache updater in `useUpdateIssue` to handle both single issue objects (`old.data`) and paginated issue arrays (`old.data.data`), ensuring `dueDate` changes reflect immediately on `DatePicker` without requiring manual refresh.
    - Added fallback prop check `issue.dueDate || issue.due_date` to `DatePicker` in `IssueProperties`.

13. **Clean Assignee/Reporter Resolution Logic ([issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
    - Simplified `currentAssigneeId` and `currentReporterId` to cleanly resolve `issue.assigneeId || issue.assignee?.id` and `issue.reporterId || issue.reporter?.id`.
    - Added automatic `unshift` insertion for assigned/reporter user into `memberOptions` if not present in paginated workspace members list, ensuring assignee name displays properly in UI.

14. **Full Clean Code, DRY & SOLID Refactoring of `IssueProperties` ([issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
    - **Single Responsibility (SRP)**: Extracted pure helper `buildMemberOptions` to manage member option generation and missing user injection outside component render loop.
    - **Don't Repeat Yourself (DRY)**: Created reusable `PropertyUserSelect` sub-component to eliminate duplicate JSX between Assignee and Reporter fields.
    - **Open-Closed & Clean Architecture**: Ensured component logic is decoupled, type-safe (no `any`), concise, and highly readable.

15. **Modular File Extraction & Separation of Concerns ([property-select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/property-select.tsx), [property-user-select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/property-user-select.tsx), [issue-options.utils.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/utils/issue-options.utils.tsx), [issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
    - Extracted `PropertySelect` to `src/features/issue-detail/components/property-select.tsx`.
    - Extracted `PropertyUserSelect` to `src/features/issue-detail/components/property-user-select.tsx`.
    - Extracted `buildMemberOptions` utility function to `src/features/issue-detail/utils/issue-options.utils.tsx`.
    - Reduced `issue-properties.tsx` to a clean, focused component solely responsible for composing issue property fields.

16. **Enhance Selected Option Display in `SearchSelect` ([search-select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/search-select.tsx))**:
    - Updated trigger input in `SearchSelect` to render `selectedOption.icon` when present on the left, and hide `MagnifyingGlassIcon` whenever an option is selected (unless actively typing a search query).
    - Rendered `selectedOption.badge` on the right (e.g., Status Badge) and swapped gray placeholder text for crisp `text-foreground` label.

17. **Fix Priority Icon & Value Matching in `IssueProperties` ([issue-properties.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-properties.tsx))**:
    - Added `PriorityIcon` component to `priorityOptions` so priority items display colored priority icons in both dropdown and trigger box.
    - Added `matchedPriorityValue` case-insensitive matching (`toLowerCase()`) to seamlessly match backend uppercase/lowercase values (e.g., `"MEDIUM"` vs `"medium"`).

18. **Strikethrough Title & Item Card Summary for Done Tasks ([issue-summary-input.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-summary-input.tsx), [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx), [issue-item-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-item-card.tsx))**:
    - Added `isDone` prop to `IssueSummaryInput` and passed status check `(issue.status || "").toLowerCase() === "done"`.
    - Applied `line-through text-muted-foreground` CSS classes to title input in Issue Detail view and item card summaries in Subtasks/Linked Issues whenever task status is "done".

19. **Clean Up IDE Warnings & Unused Imports ([use-issues.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/hooks/use-issues.ts))**:
    - Removed unused import `PaginatedResponse` from `src/features/projects/hooks/use-issues.ts`.
    - Verified `@theme` and `@utility` rules in `globals.css` are valid standard Tailwind CSS v4 syntax rules.















