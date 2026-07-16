export const PERMISSION_MATRIX = [
  {
    resource: "Workspace",
    label: "Workspace (Settings, Billing)",
    permissions: {
      read: "workspace:read",
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
      read: "role:read",
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
      read: "group:read",
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
      read: "department:read",
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
      read: "employmentType:read",
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
      read: "team:read",
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
      read: "project:read",
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
      read: "task:read",
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
      read: "comment:read",
      create: "comment:create",
      update: null,
      delete: "comment:delete",
      other: null,
    },
  },
];
