export const PERMISSION_MATRIX = [
  {
    resource: "Workspace",
    label: "Workspace (Settings, Billing)",
    permissions: {
      create: null,
      update: "workspace:update",
      delete: "workspace:delete",
      other: { id: "workspace:invite", label: "Invite" },
    },
  },
  {
    resource: "Role",
    label: "Roles & Permissions",
    permissions: {
      create: "role:create",
      update: "role:update",
      delete: "role:delete",
      other: null,
    },
  },
  {
    resource: "Group",
    label: "User Groups",
    permissions: {
      create: "group:create",
      update: "group:update",
      delete: "group:delete",
      other: null,
    },
  },
  {
    resource: "Department",
    label: "Departments",
    permissions: {
      create: "department:create",
      update: "department:update",
      delete: "department:delete",
      other: null,
    },
  },
  {
    resource: "Employment Type",
    label: "Employment Types",
    permissions: {
      create: "employmentType:create",
      update: "employmentType:update",
      delete: "employmentType:delete",
      other: null,
    },
  },
  {
    resource: "Team",
    label: "Teams",
    permissions: {
      create: "team:create",
      update: "team:update",
      delete: "team:delete",
      other: { id: "team:assign", label: "Assign" },
    },
  },
  {
    resource: "Project",
    label: "Projects",
    permissions: {
      create: "project:create",
      update: "project:update",
      delete: "project:delete",
      other: { id: "project:invite", label: "Invite" },
    },
  },
  {
    resource: "Task",
    label: "Tasks & Issues",
    permissions: {
      create: "task:create",
      update: "task:update",
      delete: "task:delete",
      other: null,
    },
  },
  {
    resource: "Comment",
    label: "Comments",
    permissions: {
      create: "comment:create",
      update: null,
      delete: "comment:delete",
      other: null,
    },
  },
];
