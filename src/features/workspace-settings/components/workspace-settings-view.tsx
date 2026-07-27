"use client";
import {
  Users,
  Shield,
  SquaresFour,
  Buildings,
  Briefcase,
  Plus,
  MagnifyingGlass,
  SlidersHorizontal,
} from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { TRANSLATION_KEYS } from "@/constants/translations";
import { Input } from "@/components/ui/forms/input";
import { PageHeader } from "@/components/ui/layout/page-header";
import { SegmentedControl } from "@/components/ui/forms/segmented-control";
import { useTranslations } from "next-intl";

import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { WorkspaceSettingsTab } from "@/features/workspace-settings/enums/workspace.enum";
import { MembersTable } from "./members-table";
import { GroupsTable } from "./groups-table";
import { RolesTable } from "./roles-table";
import { AddNewUserModal } from "./add-new-user-modal";
import { AddNewGroupModal } from "./add-new-group-modal";
import { AddNewRoleModal } from "./add-new-role-modal";
import { DepartmentsTable } from "@/features/workspace-settings/components/departments-table";
import { AddNewDepartmentModal } from "@/features/workspace-settings/components/add-new-department-modal";
import { EmploymentTypesTable } from "@/features/workspace-settings/components/employment-types-table";
import { AddNewEmploymentTypeModal } from "@/features/workspace-settings/components/add-new-employment-type-modal";
import { WorkspaceConfigTable } from "@/features/workspace-settings/components/workspace-config-table";
import { Group } from "@/types/group.types";
import {
  WorkspaceRole,
  Department,
  EmploymentType,
} from "@/types/workspace.types";
import { PageContainer } from "@/components/layout/page-container";

export function WorkspaceSettingsView() {
  const t = useTranslations("WorkspaceSettings");
  const TK_TABS = TRANSLATION_KEYS.tabs;
  const TK_VIEW = TRANSLATION_KEYS.view;
  const TK_ACTIONS = TRANSLATION_KEYS.actions;

  const tabs = [
    {
      id: WorkspaceSettingsTab.MEMBERS,
      label: t(TK_TABS.members),
      icon: Users,
    },
    {
      id: WorkspaceSettingsTab.GROUPS,
      label: t(TK_TABS.groups),
      icon: SquaresFour,
    },
    { id: WorkspaceSettingsTab.ROLES, label: t(TK_TABS.roles), icon: Shield },
    {
      id: WorkspaceSettingsTab.DEPARTMENTS,
      label: t(TK_TABS.departments),
      icon: Buildings,
    },
    {
      id: WorkspaceSettingsTab.EMPLOYMENT_TYPES,
      label: t(TK_TABS.employmentTypes),
      icon: Briefcase,
    },
    {
      id: WorkspaceSettingsTab.CONFIG,
      label: "Workspace Config",
      icon: SlidersHorizontal,
    },
  ];

  const searchPlaceholders: Record<WorkspaceSettingsTab, string> = {
    [WorkspaceSettingsTab.GENERAL]: "",
    [WorkspaceSettingsTab.TEAMS]: "",
    [WorkspaceSettingsTab.MEMBERS]: t(TK_ACTIONS.searchMembers),
    [WorkspaceSettingsTab.GROUPS]: t(TK_ACTIONS.searchGroups),
    [WorkspaceSettingsTab.ROLES]: t(TK_ACTIONS.searchRoles),
    [WorkspaceSettingsTab.DEPARTMENTS]: t(TK_ACTIONS.searchDepartments),
    [WorkspaceSettingsTab.EMPLOYMENT_TYPES]: t(
      TK_ACTIONS.searchEmploymentTypes,
    ),
    [WorkspaceSettingsTab.CONFIG]: "Search config...",
  };
  const [activeTab, setActiveTab] = useState<WorkspaceSettingsTab>(
    WorkspaceSettingsTab.MEMBERS,
  );
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole | null>(null);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isAddEmploymentTypeOpen, setIsAddEmploymentTypeOpen] = useState(false);
  const [selectedEmploymentType, setSelectedEmploymentType] =
    useState<EmploymentType | null>(null);

  const handleAddNew = () => {
    if (activeTab === WorkspaceSettingsTab.MEMBERS) setIsAddUserModalOpen(true);
    if (activeTab === WorkspaceSettingsTab.GROUPS) setIsAddGroupModalOpen(true);
    if (activeTab === WorkspaceSettingsTab.ROLES) setIsAddRoleModalOpen(true);
    if (activeTab === WorkspaceSettingsTab.DEPARTMENTS)
      setIsAddDepartmentModalOpen(true);
    if (activeTab === WorkspaceSettingsTab.EMPLOYMENT_TYPES)
      setIsAddEmploymentTypeOpen(true);
  };

  return (
    <PageContainer>
      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title={t(TK_VIEW.title)}
          description={t(TK_VIEW.description)}
          actions={
            activeTab !== WorkspaceSettingsTab.CONFIG ? (
              <Button
                variant={ButtonVariant.Primary}
                size={ButtonSize.Sm}
                onClick={handleAddNew}
                className="w-fit"
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                <span className="hidden sm:inline">{t(TK_ACTIONS.addNew)}</span>
                <span className="sm:hidden">{t(TK_ACTIONS.add)}</span>
              </Button>
            ) : null
          }
        >
          {/* Filters & Tabs Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
            {/* Tabs - Segmented Control */}
            <SegmentedControl
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as WorkspaceSettingsTab)}
            />

            {/* Quick Actions / Filters for Settings */}
            {activeTab !== WorkspaceSettingsTab.CONFIG && (
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative group">
                  <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <Input
                    type="text"
                    placeholder={searchPlaceholders[activeTab]}
                    className="w-full sm:w-55 h-8 pl-8"
                  />
                </div>
              </div>
            )}
          </div>
        </PageHeader>

        {/* Content Area */}
        {activeTab === WorkspaceSettingsTab.CONFIG ? (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeTab}
              variants={TAB_CONTENT_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <WorkspaceConfigTable />
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col w-full h-fit">
            <div className="flex-1 p-0 overflow-x-auto">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeTab}
                  variants={TAB_CONTENT_VARIANTS}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {activeTab === WorkspaceSettingsTab.MEMBERS && (
                    <MembersTable />
                  )}
                  {activeTab === WorkspaceSettingsTab.GROUPS && (
                    <GroupsTable
                      onEdit={(group) => {
                        setSelectedGroup(group);
                        setIsAddGroupModalOpen(true);
                      }}
                    />
                  )}
                  {activeTab === WorkspaceSettingsTab.ROLES && (
                    <RolesTable
                      onEdit={(role) => {
                        setSelectedRole(role);
                        setIsAddRoleModalOpen(true);
                      }}
                    />
                  )}
                  {activeTab === WorkspaceSettingsTab.DEPARTMENTS && (
                    <DepartmentsTable
                      onEdit={(department) => {
                        setSelectedDepartment(department);
                        setIsAddDepartmentModalOpen(true);
                      }}
                    />
                  )}
                  {activeTab === WorkspaceSettingsTab.EMPLOYMENT_TYPES && (
                    <EmploymentTypesTable
                      onEdit={(et) => {
                        setSelectedEmploymentType(et);
                        setIsAddEmploymentTypeOpen(true);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      <AddNewUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <AddNewGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => {
          setIsAddGroupModalOpen(false);
          setSelectedGroup(null);
        }}
        initialData={selectedGroup}
      />
      <AddNewRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => {
          setIsAddRoleModalOpen(false);
          setSelectedRole(null);
        }}
        initialData={selectedRole}
      />
      <AddNewDepartmentModal
        isOpen={isAddDepartmentModalOpen}
        onClose={() => {
          setIsAddDepartmentModalOpen(false);
          setSelectedDepartment(null);
        }}
        initialData={selectedDepartment}
      />
      <AddNewEmploymentTypeModal
        isOpen={isAddEmploymentTypeOpen}
        onClose={() => {
          setIsAddEmploymentTypeOpen(false);
          setSelectedEmploymentType(null);
        }}
        initialData={selectedEmploymentType}
      />
    </PageContainer>
  );
}
