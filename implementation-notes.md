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

20. **Fix Dependency Network Full Issue Fetch Limit ([app.config.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/config/app.config.ts), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx), [dashboard-deps-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dashboard-deps-tab.tsx))**:
    - Increased `APP_CONFIG.PAGINATION.MAX_LIMIT` to `100`.
    - Passed `{ limit: APP_CONFIG.PAGINATION.MAX_LIMIT }` in `useIssues` calls within `DependencyNodeGraph` and `DashboardDepsTab` to retrieve all issues (~30+) instead of falling back to backend's default pagination limit of 10.

21. **Reuse Board `TaskCard` Component in Dependency Nodes ([dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx), [deps.utils.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/utils/deps.utils.ts), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx))**:
    - Refactored `DependencyCustomNode` to reuse `<TaskCard issue={nodeData.issue} />` from `@/features/board/components/task-card`.
    - Extracted `getAssigneeName` and `getAssigneeAvatar` utilities in `deps.utils.ts` to display full assignee names and Cloudinary avatars across both node graph and list views.

22. **Remove Overlapping Floating Risk Dot ([dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx))**:
    - Removed redundant absolute floating risk dot (`absolute top-3 right-3`) that overlapped on top of the type badge (e.g. `Story`) when wrapping `TaskCard`.

23. **Interactive Issue Type Filter Checkboxes for Dependencies ([deps-tab-filter-bar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/filters/deps-tab-filter-bar.tsx), [dashboard-deps-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dashboard-deps-tab.tsx), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Added interactive Type Filter checkbox pills (`Story`, `Task`, `Bug`, `Subtask`, `Epic`) to `DepsTabFilterBar`.
    - Integrated `selectedTypes` filtering in `DependencyNodeGraph` to show/hide nodes and dynamic edge connections in real time based on active issue types.
    - Integrated `selectedTypes` filtering in `DashboardDepsTab` list matrix view.

24. **Refactor Checkbox Filter to Status ([deps-tab-filter-bar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/filters/deps-tab-filter-bar.tsx), [dashboard-deps-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dashboard-deps-tab.tsx), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Converted the checkbox filter pills to Status checkboxes (`To Do`, `In Progress`, `In Review`, `Done`) with `StatusBadge`.
    - Updated `DependencyNodeGraph` and `DashboardDepsTab` to filter nodes and dependencies in real time based on `selectedStatuses`.

25. **Fix Empty Filter Fallback & React Flow Graph Update ([dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx), [deps.utils.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/utils/deps.utils.ts))**:
    - Fixed bug where unchecking all status checkboxes (`selectedStatuses = []`) triggered a fallback that re-rendered all issues instead of hiding everything.
    - Updated `isStatusSelected` helper to return `false` when `selectedStatuses.length === 0`.
    - Updated `useMemo` dependency array from `[realIssues]` to `[filteredRealIssues]` so React Flow graph updates instantly whenever checkboxes are toggled.

26. **Robust Status Normalization Matching ([deps.utils.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/utils/deps.utils.ts))**:
    - Enhanced `normalizeIssueStatus` to trim, lowercase, and handle hyphens/underscores/variations (e.g. `in_progress`, `in-progress`, `doing`, `complete`, `qa`, `dev`).
    - Ensured `isStatusSelected` correctly maps backend status variations against active status filters, completely hiding unselected task cards from both React Flow graph and list views.

27. **Fix React Hook `useMemo` Missing Dependency `realIssues` ([dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx))**:
    - Replaced residual `realIssues.forEach` references on lines 149 and 161 inside `useMemo` with `filteredRealIssues.forEach`.
    - This removed the unneeded `realIssues` reference inside `useMemo`, eliminating the ESLint React Hook missing dependency warning while also ensuring the status filter correctly filters graph nodes.

28. **Distinct Border Styling & Legend for Parent vs Child (Subtask) Nodes ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx))**:
    - Added `isSubtask` check (`!!issue.parentId`) to render a crisp **White Border** for Top-Level / Parent Tasks (`!issue.parentId`).
    - Rendered an **Emerald Green Border** for Child Tasks / Subtasks (`!!issue.parentId`), matching the green dashed "Tác vụ con" edges.
    - Updated the header legend in `DependencyNodeGraph` to include indicators for `Task Cha (Viền Trắng)` and `Task Con (Viền Xanh)`.

29. **Remove Blurry Glow Shadows for Clean Flat Borders ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx))**:
    - Removed fuzzy `shadow-[0_0_12px...]` and `shadow-[0_0_24px...]` glow effects around node cards and risk indicators that made text and borders appear blurry/distracting.
    - Replaced with clean, crisp, flat border lines for optimal readability.

30. **Hover-Only Border Color Transitions for Task Cards ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx))**:
    - Changed default state of all node cards back to standard subtle container border (`border-border/80`).
    - Applied hover-only border color triggers: Hovering a Task Cha changes its border to White (`hover:border-slate-400 dark:hover:border-white`), while hovering a Task Con (subtask) changes its border to Emerald Green (`hover:border-emerald-500 dark:hover:border-emerald-400`).
    - Refactored `DependencyCustomNode` helper functions to keep cognitive complexity low (<15).

31. **Interactive Click Event to Open Issue Detail View ([deps.types.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/types/deps.types.ts), [deps.utils.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/utils/deps.utils.ts), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx), [dependency-node-graph.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-node-graph.tsx), [dashboard-deps-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dashboard-deps-tab.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Added `onIssueClick` callback to `DependencyNodeGraphProps`, `DependencyNodeData`, and `DashboardDepsTabProps`.
    - Added `onNodeClick` handler on ReactFlow canvas and passed `onIssueClick` into custom task nodes so clicking any node opens the `IssueDetailView` drawer.
    - Mapped `sourceIssueId` and `targetIssueId` into `DependencyItem` and bound `onClick` handlers to both blocker and blocked task cards in list view mode.
    - Wired `onIssueClick={setSelectedIssueId}` in `DashboardView` so URL search param `?issueId=...` updates seamlessly.

32. **Navigation Events for Subtasks, Linked Issues, and Parent Task in Issue Detail View ([issue-item-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-item-card.tsx), [issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx), [issue-linked-issues.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-linked-issues.tsx), [issue-main-content.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-main-content.tsx), [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Added `onClick` support to `IssueItemCard` so item cards are interactive.
    - Added `onIssueSelect` callback flow down through `IssueDetailView` -> `IssueMainContent` -> `IssueSubtasks` & `IssueLinkedIssues`.
    - Bound `onClick` handlers to Parent Task, Subtasks, and Linked Issue cards so clicking any related issue immediately navigates to that issue's detail view within the drawer.

33. **Isolate Custom Hover Border Styling to Dependencies Tab Only ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx))**:
    - Restored default `TaskCard` hover styling back to standard Kanban Board behavior (`hover:border-primary/50`).
    - Passed custom `hoverBorderClass` explicitly from `DependencyCustomNode` so White/Emerald Green hover borders apply strictly inside the Dependencies node graph canvas, preventing unintended hover color changes on Kanban Board columns.

34. **Eliminate Double Border & Corner Radius Indentation Bug ([dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx))**:
    - Removed `ring-2` styling from outer container `div` which caused a double-border effect and an indented gap between outer ring (`rounded-xl`) and inner card (`rounded-lg`).
    - Consolidated all border, hover, and highlight classes directly onto `TaskCard` / `ItemCard` for a clean, single-layer 100% flush border alignment.

35. **Refactor Status Filter Toggle Buttons to Match App Design System ([deps-tab-filter-bar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/filters/deps-tab-filter-bar.tsx))**:
    - Removed native HTML `<input type="checkbox">` elements and awkward double-pill borders (`pill inside pill`).
    - Replaced with clean interactive button pills featuring Phosphor `CheckSquareIcon` (filled theme color when selected) and `SquareIcon` (subtle outline when unselected).
    - Unified button styling with `rounded-lg`, `bg-accent/60 border-border` when active and `opacity-40 hover:opacity-75` when inactive, aligning 100% with TaskFi design system.

36. **Fix TopNav Breadcrumb 404 Bug on "Projects" Click ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Replaced raw URL string slicing (`pathname.split("/").slice(0, i+1).join("/")`) which generated invalid `/projects` URLs resulting in 404 errors.
    - Implemented route-based structured breadcrumb generation mapping `Projects` directly to `/` (the root Projects dashboard route), `[Project Name]` to `/projects/${projectId}`, and feature pages to their respective routes.
    - Preserved integration with `navigation.store.ts` for active sub-navigation items.

37. **Store-Driven Navigation System & Navigation History Management ([navigation.store.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/store/navigation.store.ts), [top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Expanded Zustand `navigation.store.ts` to manage the full navigation stack (`stack: NavigationItem[]`), history stack (`history: NavigationItem[][]`), and active index (`historyIndex`).
    - Added `navigateToIndex(index)`, `goBack()`, and `goForward()` store actions to maintain exact navigation history across sessions.
    - Refactored `top-nav.tsx` to read directly from `useNavigationStore` as the single source of truth for breadcrumb rendering, eliminating all in-component URL path string parsing.

38. **Isolate Top-Level Independent Feature Breadcrumbs ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Separated top-level standalone feature routes (`/docs`, `/my-tasks`, `/calendar`, `/workspaces`, `/user-settings`, `/workspace-settings`) from project-scoped routes.
    - Removed `Projects /` prefix from independent top-level pages so `/docs` renders simply as `Documents` (or `Documents / Folder Name`) instead of `Projects / Docu39. **Event-Driven Navigation & Pure Consumer TopNav Architecture ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx), [sidebar-nav-item.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-nav-item.tsx), [project-group-section.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/project-group-section.tsx), [projects-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/projects-view.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Removed all `useEffect` route-parsing and path-matching logic inside `TopNav`, turning `TopNav` into a pure, dumb UI subscriber of `useNavigationStore`.
    - Moved navigation stack dispatches (`setStack`, `push`) into actual user navigation event handlers (`SidebarNavItem` click, `ProjectGroupSection` card click) and page view mount hooks (`ProjectsView`, `DashboardView`).

40. **Push Selected Issue to Navigation Store Stack ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Synchronized `selectedIssueId` with `navigation.store.ts` so that clicking an issue card dynamically appends the issue (`Projects / Taskfi Management / [Icon] HYD-31`) to the breadcrumb stack in `TopNav`.
    - Added `TypeIcon` rendering in `TopNav` for issue breadcrumb nodes and restored pop/restore behavior upon closing the Issue Detail drawer.

41. **Flicker-Free Event-Driven Push/Pop for Issue Detail ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx))**:
    - Shifted `push` and `pop` calls directly inside the synchronous `setSelectedIssueId` event handler.
    - Passed target `issueData` (`issueKey`, `type`) straight from the click event, updating Zustand store synchronously (0ms latency) without waiting for asynchronous query effects, completely eliminating breadcrumb flicker.

42. **Universal 0ms Latency Event Synchronous Navigation ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [issue-table-row.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issues/components/issue-table-row.tsx), [dependency-custom-node.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/deps/components/dependency-custom-node.tsx), [dashboard-issues-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issues/components/dashboard-issues-tab.tsx), [dashboard-backlog-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/backlog/components/dashboard-backlog-tab.tsx), [dashboard-done-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/done/components/dashboard-done-tab.tsx))**:
    - Standardized `onIssueClick` signature across all tabs (Kanban, Issue Tracker, Backlog, Done, Dependencies Graph, Issue Detail) to pass `(issueId, issueData)` directly on click.
    - Guaranteed instant 0ms latency breadcrumb updates across all views without any reliance on async query loading state.

43. **Eliminate Query-Based ID Flashing ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx))**:
    - Removed `useIssue` query and query-dependent `useEffect` inside `DashboardView` that previously set `name = selectedIssueId` before the API resolved.
    - Guaranteed `name: issueData.issueKey` is pushed synchronously on click from memory, completely resolving raw ID flashes on TopNav.

44. **Enable Always-Active Back and Forward Header Navigation ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Unlocked Back (`<`) and Forward (`>`) buttons in `TopNav` by removing `disabled` attributes and `opacity-40` blocking styles.
    - Configured `handleGoBack` and `handleGoForward` to check `useNavigationStore` history first and fallback gracefully to `router.back()` and `router.forward()`.

45. **Fully-Attributed Navigation Href & URL Syncing ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Attached target issue URL (`/projects/${projectId}?issueId=${id}`) to `href` in `pushNav`, allowing Back/Forward history navigation and breadcrumb clicks to restore exact URL states with open drawer parameters.
    - Added an automatic stack cleanup `useEffect` ensuring leftover issue breadcrumbs are cleared if the URL query parameter `issueId` is removed or closed.

46. **Universal Retros & Custom Overlay Navigation Sync ([retro-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/retros/components/retro-card.tsx), [dashboard-retros-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/retros/components/dashboard-retros-tab.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx))**:
    - Extended synchronous 0ms event-driven navigation to Retrospectives (`setSelectedRetroId`), pushing full `targetHref` (`/projects/${projectId}?retroId=${id}`) and note title directly on click.
    - Guaranteed identical URL restoration, 0ms latency, zero API loading delays, and zero raw ID flashes across all features and modals.

47. **Ultra-Simple URL & React Query Cache Navigation Architecture ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [sidebar-nav-item.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/sidebar-nav-item.tsx), [project-group-section.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/project-group-section.tsx))**:
    - Replaced manual store push/pop synchronization with a pure, self-contained `TopNav` hook that derives breadcrumbs directly from `pathname` + `searchParams` + React Query Cache.
    - Simplified `setSelectedIssueId` and `setSelectedRetroId` down to clean 3-line URL parameter toggles.
    - Enabled native browser Back (`router.back()`) and Forward (`router.forward()`), eliminating all prop-drilling and state duplication across components.

48. **IDE Type Safety & Clean Callback Signatures ([dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [retro-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/retros/components/retro-card.tsx), [dashboard-retros-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/retros/components/dashboard-retros-tab.tsx))**:
    - Fixed `onIssueSelect` callback signature in `DashboardView` to match 1-argument `(id: string)` signature.
    - Cleaned `onRetroClick` signature in `RetroCard` and `DashboardRetrosTabProps` back to `(retroId: string) => void`, resolving all IDE TypeScript errors.

49. **Synchronous React Query Cache Lookup (Zero Flashing Raw IDs) ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - ponytail: Implemented synchronous React Query Cache lookup (`findIssueInCache`) inside `TopNav` using `useQueryClient().getQueriesData`.
    - Instantly resolves `targetIssue.issueKey` (`HYD-35`) in **0ms** from RAM without waiting for async `useIssue` queries.
    - Replaced raw hex ID fallbacks (`60238f9...`) with `"Loading..."`, permanently fixing all raw ID flashing issues.

50. **Smooth Framer Motion Breadcrumb Variants & Micro-Interactions ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Added `breadcrumbContainerVariants` and `breadcrumbItemVariants` to `TopNav` using Framer Motion spring physics.
    - Wrapped breadcrumb items with `AnimatePresence mode="popLayout"` for smooth slide-in, layout shift (`layout`), and fade-out animations.
    - Added interactive `whileHover` and `whileTap` micro-interactions to Back/Forward buttons and breadcrumb nodes.

51. **Sleek Breadcrumb Separator Styling ([top-nav.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/layout/top-nav.tsx))**:
    - Replaced raw text slash (`/`) with a crisp, modern `<CaretRightIcon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 select-none mx-0.5" />` following Linear / Apple design system standards.

52. **Subtasks Header Add Button & Full CreateTaskModal Integration ([issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx))**:
    - Added an interactive `+` (`PlusIcon`) button to the right side of the Subtasks section header in Issue Detail view.
    - Connected the `+` button directly to `CreateTaskModal` passing `parentId={parentId}`, allowing users to open the full task creation modal with all rich fields (summary, description, assignee, priority, due date, story points, attachments) pre-configured for subtask creation.

54. **Google Drive Style Document Picker Modal Integration ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx), [attachment-uploader.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/attachment-uploader.tsx), [file-uploader.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/file-uploader.tsx))**:
    - Built a Google Drive-styled `DocumentPickerModal` featuring live search, folder selection, category filters, grid/list view toggles, author badges, file extensions, and multi-selection checkboxes.
    - Embedded a **Browse Project Docs** button inside `AttachmentUploader` and `FileUploader`, enabling users to select multiple documents from the project's Document Library (`/docs`) and attach them directly to tasks.

55. **TypeScript & Tailwind Linting Cleanup ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Replaced `FileSpreadsheetIcon` with `TableIcon`.
    - Corrected `ButtonVariant.Ghost`, `ButtonVariant.Primary`, `ButtonSize.Sm` enum references.
    - Resolved ModalHeader required `title` prop and updated Tailwind utilities (`stroke-3`, `max-w-22.5`, `shrink-0`).

56. **Standard Shared Modal Structure Refactoring ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Refactored `DocumentPickerModal` to 100% align with the project's shared modal system (`Modal`, `ModalContent`, `ModalHeader`, `ModalBody`, `ModalScrollArea`, `ModalFooter`).
    - Standardized modal backdrop, rounded container (`rounded-[20px]`), inner card frame (`rounded-[16px] border border-border/60`), scroll area padding, and unified header/footer button layouts.

57. **OS Finder / File Explorer Navigation Architecture ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Transformed document picker into a full-fledged OS File Explorer (macOS Finder / Windows Explorer style).
    - Integrated interactive folder navigation with drill-down directory levels, clickable breadcrumb path navigation (`Root > Frontend Engineering`), back button (`CaretLeftIcon`), and search across all folders.
    - Maintained multi-file selection state across folders so users can pick documents from different directories and confirm attachment in a single step.

58. **Pure Column / List Layout Simplification ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Removed Grid view layout complexity and view toggle buttons as requested by the user.
    - Streamlined all folders and document listings into clean, elegant column / list rows with high scannability and fast multi-selection interactions.

59. **Documents Page Design System Table Synchronization ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Synchronized `DocumentPickerModal` with the exact Table layout system used in the project's Documents Page (`/documents`).
    - Integrated `<Table>`, `<TableHeader>`, `<TableHead>`, `<TableBody>`, `<TableRow>`, `<TableCell>`, filter tabs (`All Folders`, `By Team`, `By Project`), folder row styling (`getFolderColorStyle`), type badges (`• TEAM`, `• PROJECT`), file count, owner, and file row checkboxes for exact visual consistency.

60. **Title Navigation & Breadcrumb Removal ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Removed the redundant "Root" text and pill container from the top navigation bar.
    - Replaced with a clean, dynamic title displaying "All Documents" (at root level) or the active folder name (e.g. `Frontend Engineering`) alongside the `<` Back button.

61. **Constant Modal Height Stabilization ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Fixed modal height to a constant `h-[640px] max-h-[85vh]` on `ModalContent` and `flex-1 h-full` on `ModalScrollArea`.
    - Prevents the modal container from shrinking or jumping when navigating into folders containing very few items (e.g. 1 file or empty folders).

62. **Fix `Avatar` Component Prop Type Error ([document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Replaced non-existent `name` prop on `<Avatar />` component with `fallback={doc.author.name}`.

63. **Full API Integration for My Tasks View ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Created custom hook `useMyTasks` to fetch assigned issues for the current user across all projects in the active workspace.
    - Connected real API data to `MyTasksList` with dynamic tab filtering (`All`, `Due Today`, `Overdue`, `No Due Date`), interactive search, priority badges, project indicators, and empty/loading states.
    - Integrated `<IssueDetailView />` drawer so clicking any task row opens its detail drawer for instant editing.
    - Integrated `<CreateTaskModal />` for creating new tasks directly into the user's workspace projects.

64. **Fix IDE Linter Warnings & Relative Imports ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx), [document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Replaced relative imports (`../hooks/use-my-tasks`) with `@/features/my-tasks/hooks/use-my-tasks` adhering to project clean code guidelines.
    - Simplified Tailwind arbitrary values: `w-[180px]` -> `w-45`, `sm:w-[220px]` -> `sm:w-55`, `h-[640px]` -> `h-160`, `w-[40px]` -> `w-10`.

65. **Refine `useMyTasks` Multi-Project Query & Fallback Matching ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Implemented sequence: Groups -> Projects -> Assigned Issues for each project in the active workspace.
    - Added fallback client-side filtering (`assigneeId === currentUserId || assignee.id === currentUserId`) to ensure user's assigned tasks are completely retrieved even if API query parameters vary.

66. **Standardize Max Pagination Limit Config ([app.config.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/config/app.config.ts), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Updated `APP_CONFIG.PAGINATION.MAX_LIMIT` in [app.config.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/config/app.config.ts) to `100`.
    - Replaced hardcoded `limit: 100` in `useMyTasks` queries with `APP_CONFIG.PAGINATION.MAX_LIMIT`.

67. **Ultra-Resilient Data Resolution & Multi-Tier Fallback Strategy ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Handled flexible structure parsing for `currentUser` (`userObj.id || userObj.data.id || userObj._id`) and `groups` (`Array.isArray(rawGroups)` / `rawGroups.data`).
    - Added multi-tier task fallback: 1) Assignee match, 2) Reporter match, 3) Project tasks fallback so that user always sees workspace project tasks cleanly.

68. **Project Filter Dropdown Integration for My Tasks ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Added `<Select />` dropdown filter for project selection (`All Projects` + dynamic workspace projects list) in the My Tasks header toolbar.
    - Integrated `selectedProjectFilter` prop into `MyTasksList` to filter task items in real time by selected project.

69. **Kanban Board & Issue List Empty State Card Integration ([board-column.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/board-column.tsx), [issue-list-tab.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issues/components/issue-list-tab.tsx))**:
    - Integrated dashed Empty State placeholder card inside `BoardColumn` when column count is 0, featuring "No tasks in [Column]" and a quick `+ Add task` action button.
    - Integrated global `<EmptyState />` card in `IssueListTab` when no issues exist.

70. **Priority Badge Icon & Theme Alignment ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Integrated Phosphor priority icons (`EqualsIcon`, `CaretUpIcon`, `WarningCircleIcon`, `CaretDownIcon`) directly inside `<Badge />` component for Priority column.
    - Standardized uppercase priority labels (`MEDIUM`, `HIGH`, `CRITICAL`, `LOW`) matching the design system standard across Issue Tracker and Board views.

71. **Project Avatar Component Integration ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Replaced simple colored dots in the Project column with the reusable `<Avatar />` component.
    - Displays project logo image when available or clean fallback initials with subtle themed background borders.

72. **Strict Type Safety & Linter Warnings Clean-up ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Eliminated all explicit `any` usages in `use-my-tasks.ts` using structured helper types (`DynamicUser`, `DynamicDataWrapper`, `DynamicFile`).
    - Verified Tailwind CSS class standards (`h-160`, `w-10`) in `document-picker-modal.tsx`.

73. **Refactor & Elegant Data Unwrapping (`use-my-tasks.ts`)**:
    - Abstracted verbose inline data unwrapping and type assertions into a generic `extractArrayData<T>` helper function.
    - Cleaned up hook implementation logic making code concise, elegant, readable, and 100% type-safe.

74. **Project Logo & Key Badge UI Alignment ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Standardized Project icon rendering to match [project-group-section.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/project-group-section.tsx#L56).
    - Renders project logo image (`Image`) when set, or stylish project key badge (`projectKey` / initial letters) inside clean bordered container box.

75. **Direct Project Avatar Extraction from Issue Object ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Updated `useMyTasks` to extract `issue.project.avatarUrl`, `issue.project.name`, and `issue.project.key` directly from issue payload returned by backend API.
    - Added `unoptimized` flag to external Cloudinary images in `MyTasksList` to prevent Next.js image optimization errors.

76. **Project Column Compact Tooltip Optimization ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Wrapped Project logo/avatar badge with `<Tooltip content={task.project} position="top" />`.
    - Removed redundant project name text string from the table column cell for a cleaner, ultra-compact UI layout.

77. **Avatar Component Error-Fallback Support ([avatar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/data-display/avatar.tsx), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Added `imageError` state and `onError` handler to `<Avatar />` component to automatically fall back to initial letters when image URLs fail or 404.
    - Simplified `MyTasksList` project rendering by consuming `<Avatar src={task.projectLogoUrl} fallback={task.projectKey || task.project} />`.

78. **Fixed Column Widths Alignment across Task Tables ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Applied explicit matching width classes (`Key`: `w-28`, `Type`: `w-28`, `Project`: `w-24`, `Due date`: `w-36`, `Priority`: `w-32`, `Actions`: `w-12`) across both `TableHead` and `TableCell`.
    - Eliminated layout shifting and co-dãn (column auto-resizing) between Active Tasks and Done tables.

79. **Strict Table-Fixed & Min/Max-Width Pixel Locking ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Enforced `table-fixed` CSS table layout on `<Table className="w-full table-fixed">`.
    - Applied strict `min-w-[px]` and `max-w-[px]` Tailwind utility classes across all columns to lock widths against browser content recalculation.

80. **Staggered Spring Motion Animations Integration ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Integrated `STAGGER_CONTAINER_VARIANTS` and `SPRING_CARD_VARIANTS` from `@/constants/animations` into `MyTasksList`.
    - Aligned entrance animation behavior with Backlog tab for a cohesive 60fps spring motion experience across the application.

81. **Issue Detail View Integration on Task Row Click ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Updated `MyTasksView` to render `<IssueDetailView>` directly when `selectedIssueId` & `selectedProjectId` are set on task row click.
    - Enables full issue detail panel (AI assistant, sub-tasks, comments, attachments, priority, assignee, status updates) with clean back/close navigation back to My Tasks list.

82. **Direct Project URL Routing Navigation ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Replaced in-page drawer state with Next.js router navigation: `router.push(/projects/${task.projectId}?issueId=${task.issueId})`.
    - Navigates directly to the project view (`/projects/[projectId]?issueId=[issueId]`) displaying the top navigation breadcrumb (`Projects > Project Name > Key`) alongside the Issue Detail drawer.

83. **Removal of Redundant Actions Column ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Removed three-dots (`...`) action button column and icon import from `MyTasksList`.
    - Entire task row is clickable directly to navigate to project issue detail, removing unnecessary UI clutter.

84. **Complete Elimination of Mock/Fallback Data ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed `if (userIssues.length === 0) userIssues = projectIssues;` fallback logic to strictly return real user assigned/reported tasks.
    - Deleted unused `mock-data.ts` file from `src/features/my-tasks/components/`.

85. **Direct API IssueKey Mapping ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Updated `id` mapping in `useMyTasks` to map directly to `issue.issueKey` returned by the backend API payload.

86. **Clean Direct API Fields Mapping ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed redundant fallback expressions (`|| "Task"`, `|| "Medium"`, `|| "To Do"`, `|| null`) in `useMyTasks`.
    - Mapped `type`, `dueDate`, `priority`, and `status` directly to actual values returned by the backend API.

87. **Elimination of Legacy projInfo Helper ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed `projInfo` fallback object construction and `PROJECT_COLORS` helper array from `useMyTasks`.
    - Simplified project mapping with `const project = issue.project || projectMap.get(issue.projectId)` to read project attributes directly from the issue payload returned by the backend API.

88. **API Response Issue Type Schema Alignment ([issue.types.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/types/issue.types.ts), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Updated TypeScript `Issue` interface to accurately match the backend API payload response schema (`description?`, `assigneeId?`, `dueDate?`, `storyPoints?`, etc.).
    - Ensured `useMyTasks` filters tasks safely by checking `assignee?.id` and `reporter?.id` directly from the backend JSON response payload.

89. **Direct Usage of Global Issue Type ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Completely removed custom `MyTaskItem` type mapping and wrapper objects.
    - Updated `useMyTasks` hook to return `Issue[]` directly from `@/types/issue.types`.
    - Refactored `MyTasksList` and `MyTasksView` to consume `Issue` type directly, unifying data types across the application.

90. **Safe API Array Extraction Helper ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Retained and streamlined `extractArrayData<T>` helper to safely unwrap nested paginated API response structures (`res.data.data` / `res.data` / `res`) without risk of `undefined` runtime errors.

91. **Clean 1-Line getList Extractor ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Replaced multi-branch `extractArrayData` helper with concise 1-line `getList` helper using optional chaining (`res?.data?.data || res?.data || (Array.isArray(res) ? res : [])`).

92. **Paginated Groups API Alignment ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [projects-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/projects-view.tsx), [add-new-project-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/add-new-project-modal.tsx))**:
    - Passed `{ limit: APP_CONFIG.PAGINATION.MAX_LIMIT }` to `useGroups` calls to fetch all groups when Backend added pagination to `/groups`.
    - Handled unwrapping of paginated response structure (`groupsResponse.data.data` or `groupsResponse.data`) with explicit typing.

93. **Group Service Return Type Update ([group.service.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/services/group.service.ts), [reports-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/reports/components/reports-view.tsx), [groups-table.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/workspace-settings/components/groups-table.tsx))**:
    - Updated `groupService.getGroups` return type from `BaseResponse<Group[]>` to `PaginatedResponse<Group>` to match paginated API structure.
    - Refactored `ReportsView` and `GroupsTable` to access `groupsResponse?.data?.data` properly with TypeScript type safety.

94. **Simplified Groups Extraction ([add-new-project-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/add-new-project-modal.tsx), [projects-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/components/projects-view.tsx))**:
    - Cleaned up complex legacy fallback condition and replaced with straightforward `groupsResponse?.data?.data || []`.

95. **Direct Optional Chaining in useMyTasks ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed `getList` helper from `use-my-tasks.ts`.
    - Simplified groups array extraction to `groupsRes?.data?.data || []`.

96. **Strict Typing - Zero Any Violation ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed all remaining `: any` and `as any` type casts in `use-my-tasks.ts`.
    - Leveraged TypeScript inference from `PaginatedResponse<Project>` and `PaginatedResponse<Issue>` returned by `projectService.getProjects` and `issueService.getIssuesByProject`.

97. **PaginatedResponse Direct Access ([use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Removed `extractData` helper function completely.
    - Used clean direct property access `res.data?.data || []` since `groupService`, `projectService`, and `issueService` are all strongly typed with `PaginatedResponse<T>`.

98. **Dedicated GET /workspaces/:workspaceId/my-tasks API Integration ([issue.service.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/services/issue.service.ts), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts), [issue.types.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/types/issue.types.ts))**:
    - Added `GetMyTasksParams` interface and `issueService.getMyTasks` endpoint method.
    - Refactored `useMyTasks(filters?: GetMyTasksParams)` hook to fetch tasks directly from `/workspaces/:workspaceId/my-tasks` in 1 single optimized HTTP request.
    - Automatically extracted unique projects from returned tasks for filter dropdown.

99. **Tailwind CSS Warnings Cleanup ([my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx), [document-picker-modal.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/documents/components/document-picker-modal.tsx))**:
    - Replaced arbitrary pixel size class names (`min-w-[112px]`, `min-w-[80px]`, `min-w-[144px]`, `min-w-[128px]`, `h-[640px]`, `w-[40px]`) with standard Tailwind utility classes (`min-w-28`, `min-w-20`, `min-w-36`, `min-w-32`, `h-160`, `w-10`).

100. **Consolidation of useMyTasks Hook ([use-issues.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/hooks/use-issues.ts), [use-my-tasks.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/hooks/use-my-tasks.ts))**:
    - Moved `useMyTasks` hook implementation directly into `src/features/projects/hooks/use-issues.ts` alongside all other issue-related React Query hooks.
    - Re-exported `useMyTasks` from `src/features/my-tasks/hooks/use-my-tasks.ts` to preserve backward compatibility.

101. **Concise Standard 6-Line useMyTasks Hook ([use-issues.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/projects/hooks/use-issues.ts), [my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Simplified `useMyTasks` into a clean 6-line `useQuery` wrapper for `issueService.getMyTasks(workspaceId, params)`.
    - Moved workspace state reading and project derivation into `MyTasksView`.

102. **Direct API Query Parameters Integration ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Connected `searchQuery` and `selectedProjectFilter` directly to `useMyTasks(activeWorkspaceId, filters)` query parameters (`search`, `projectId`).
    - Derived lightweight `{ id, name }` project list from `tasks` solely for rendering UI select options and providing `defaultProjectId` for task creation modal.

103. **Stabilization of `tasks` Array Reference ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Wrapped `tasks` array evaluation (`myTasksRes?.data?.data || []`) in `useMemo` with dependency `[myTasksRes?.data?.data]`.
    - Prevents creating a new empty array literal (`[]`) reference on every render when `myTasksRes?.data?.data` is undefined, stabilizing dependencies of downstream `useMemo` hooks (such as `projects`).

104. **Fetching Workspace Projects via API ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Integrated `useGroups` and `useProjects` hooks to fetch real workspace projects directly from the API.
    - Combined API projects with existing assigned tasks' projects to guarantee `defaultProjectId` exists even when the user has 0 tasks assigned, restoring full functionality to the "Add Task" modal.

105. **Stabilization of `apiProjects` Array Reference ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Wrapped `apiProjects` initialization (`projectsRes?.data?.data || []`) in its own `useMemo` hook with dependency `[projectsRes?.data?.data]`.
    - Eliminates creation of unstable empty array references `[]` on every render when `projectsRes` is loading or undefined, preventing `useMemo` for `projects` from recalculating unnecessarily.

106. **Remove Redundant Add Task Button & Direct Project Derivation ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Removed redundant `Add Task` button, `isAddTaskModalOpen` state, and `<CreateTaskModal />` from `MyTasksView`.
    - Removed unnecessary `useGroups` and `useProjects` API calls (`groupsRes`, `projectsRes`, `apiProjects`).
    - Derived `projects` directly from user's `tasks` (`map.set(t.projectId, ...)`), streamlining component performance and eliminating extra HTTP requests.

107. **Clean Removal of Project Filter Dropdown & Unused Logic ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Removed `selectedProjectFilter` state, `projects` `useMemo`, and `<Select>` dropdown UI.
    - Removed `selectedProjectFilter` prop and filtering logic from `MyTasksList`.
    - Made `MyTasksView` lean, clean, fast, and free of unused dependencies.

108. **Sub-component Extraction & DRY Icon Resolution ([my-task-row.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-task-row.tsx), [my-tasks-list.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-list.tsx))**:
    - Extracted `MyTaskRow` sub-component to `src/features/my-tasks/components/my-task-row.tsx` adhering to Single Responsibility Principle (SRP).
    - Integrated shared `ISSUE_TYPE_CONFIG` and `PRIORITY_CONFIG` from `@/features/issues/constants/issue-ui.constants.ts` eliminating 15 lines of duplicate type-icon `if/&&` checks.
    - Reduced `my-tasks-list.tsx` from 310 lines to ~130 lines of clean layout orchestration.

109. **Remove Redundant Hook Re-export File ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Updated `MyTasksView` to import `useMyTasks` directly from `@/features/projects/hooks/use-issues`.
    - Deleted redundant 2-line re-export file `src/features/my-tasks/hooks/use-my-tasks.ts` and empty directory.

110. **Shared `<PriorityBadge />` Component Creation ([priority-badge.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/data-display/priority-badge.tsx), [my-task-row.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-task-row.tsx))**:
    - Extracted reusable `<PriorityBadge />` component to `src/components/ui/data-display/priority-badge.tsx`.
    - Centralized `PRIORITY_VARIANT_MAP` (`urgent`/`critical` -> `red`, `high` -> `orange`, `medium` -> `amber`, `low` -> `slate`) and icon lookup logic.
    - Simplified `MyTaskRow` to render `<PriorityBadge priority={task.priority} />`, completely eliminating inline ternary logic duplication across the project.

111. **Project-Wide Integration of `<PriorityBadge />` Component ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [issue-table-row.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issues/components/issue-table-row.tsx))**:
    - Integrated `<PriorityBadge />` across Kanban Board `TaskCard` (`src/features/board/components/task-card.tsx`, `src/features/dashboard/components/task-card.tsx`) and Issue Tracker tables (`src/features/issues/components/issue-table-row.tsx`, `src/features/dashboard/components/issue-table-row.tsx`).
    - Removed redundant local `PRIORITY_BADGE_VARIANTS` mappings and duplicate `PriorityIconComponent` helpers across all views.

112. **IDE Linter Errors & Unused Imports Cleanup ([task-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/board/components/task-card.tsx), [issue.types.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/types/issue.types.ts))**:
    - Restored `Badge` import in `TaskCard` for issue type badges (`<Badge variant={TYPE_BADGE_VARIANTS[type]}>`).
    - Cleaned up unused `WarningCircleIcon`, `CaretUpIcon`, `EqualsIcon`, `CaretDownIcon` imports from `src/features/dashboard/components/task-card.tsx`.
    - Resolved redundant type alias warnings in [issue.types.ts](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/types/issue.types.ts) by deriving union types from constant object declarations.

113. **Pass Pagination Limit Config in MyTasksView ([my-tasks-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/my-tasks/components/my-tasks-view.tsx))**:
    - Imported `APP_CONFIG` from `@/config/app.config`.
    - Passed `{ limit: APP_CONFIG.PAGINATION.MAX_LIMIT }` in `filters` memo object to `useMyTasks` query.

114. **60fps Micro-Animations & Spring Transitions for Issue Detail View ([issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx), [dashboard-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/dashboard/components/dashboard-view.tsx), [issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx), [issue-linked-issues.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-linked-issues.tsx))**:
    - Wrapped `IssueDetailView` with `AnimatePresence` and spring variants (`TAB_CONTENT_VARIANTS`) for smooth enter/exit transitions when opening/closing or switching issues.
    - Added staggered entrance animation variants (`SLIDE_IN_LEFT_VARIANTS`, `SLIDE_IN_RIGHT_VARIANTS`, `FADE_SLIDE_UP_VARIANTS`) across AI Chat Sidebar, Header, Main Content, and Issue Properties.
    - Wrapped Subtasks and Linked Issues cards in `<AnimatePresence mode="popLayout">` with `<motion.div layout>` for 60fps card adding/removal/re-ordering micro-interactions.

115. **Restore `CreateTaskModal` Import in `IssueSubtasks` ([issue-subtasks.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-subtasks.tsx))**:
    - Restored `CreateTaskModal` import in `src/features/issue-detail/components/issue-subtasks.tsx`, resolving the missing component error.

116. **Hide Scrollbars on Issue Detail View & AI Chat Sidebar ([issue-detail-view.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-detail-view.tsx), [ai-chat-sidebar.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/ai-chat-sidebar.tsx))**:
    - Replaced `custom-scrollbar` with `hide-scrollbar` on scrollable containers in `IssueDetailView` and `AiChatSidebar` to completely hide vertical scrollbars while preserving full scrollability.

117. **Standardized Alignments, Heights & Header Padding across Issue Detail Sections ([property-select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/property-select.tsx), [property-user-select.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/property-user-select.tsx), [date-picker.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/components/ui/forms/date-picker.tsx), [issue-main-content.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-main-content.tsx))**:
    - Unified form field heights (`h-9` / 36px) across `PropertySelect`, `PropertyUserSelect`, and `DatePicker`.
    - Standardized label header container structures (`flex items-center justify-between min-h-4`) and section gaps (`flex flex-col gap-1.5 relative`) across Description, Parent Task, Subtasks, Linked Issues, and Right Properties for pixel-perfect vertical alignment.

118. **Fixed 4px Vertical Offset between Left & Right Column Fields ([issue-main-content.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-main-content.tsx), [issue-item-card.tsx](file:///Users/datngovantien/Projects/fontend/taskfi_nextjs/src/features/issue-detail/components/issue-item-card.tsx))**:
    - Synchronized outer flex column gaps between `IssueMainContent` (`gap-4` / 16px) and `IssueProperties` (`gap-4` / 16px).
    - Set explicit height `h-9` (36px) on `IssueItemCard` matching `SearchSelect`, ensuring `Description` input box and `STATUS` dropdown box align 100% pixel-perfectly horizontally across columns.







































