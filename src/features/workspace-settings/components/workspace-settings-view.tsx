"use client";

import { useState } from "react";
import { Users, Shield, UserCog, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { SegmentedControl } from "@/components/ui/segmented-control";

import { MembersTable } from "./members-table";
import { GroupsTable } from "./groups-table";
import { RolesTable } from "./roles-table";
import { AddNewUserModal } from "./add-new-user-modal";
import { AddNewGroupModal } from "./add-new-group-modal";
import { AddNewRoleModal } from "./add-new-role-modal";

type Tab = "members" | "groups" | "roles";

const tabs = [
  { id: "members", label: "Members", icon: Users },
  { id: "groups", label: "Groups", icon: UserCog },
  { id: "roles", label: "Roles", icon: Shield },
];

export function WorkspaceSettingsView() {
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  const handleAddNew = () => {
    if (activeTab === "members") setIsAddUserModalOpen(true);
    if (activeTab === "groups") setIsAddGroupModalOpen(true);
    if (activeTab === "roles") setIsAddRoleModalOpen(true);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#FCFCFD] overflow-y-auto">
      {/* Subtle Top Mesh Gradient (Mobbin Style) */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-br from-rose-100/50 via-blue-50/30 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />
      <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-gradient-to-bl from-indigo-50/50 via-purple-50/20 to-transparent blur-[100px] pointer-events-none -z-10 opacity-70" />

      {/* Main Container - Responsive padding */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 pt-5 pb-6">
        {/* Header Area */}
        <PageHeader
          className="mb-4"
          title="Workspace Settings"
          description="Manage members, roles, and groups"
          actions={
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddNew}
              className="w-fit"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="hidden sm:inline">Add new</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        >
          {/* Filters & Tabs Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-0">
            {/* Tabs - Segmented Control */}
            <SegmentedControl
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(id) => setActiveTab(id as Tab)}
            />

            {/* Quick Actions / Filters for Settings */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative group">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full sm:w-[220px] h-8 pl-8 pr-3 bg-white border border-slate-200/80 rounded-md text-[12.5px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                />
              </div>
            </div>
          </div>
        </PageHeader>

        {/* Content Area */}
        <div className="bg-white border border-slate-200/60 rounded-lg shadow-sm overflow-hidden flex flex-col w-full min-h-[400px]">
          <div className="flex-1 p-0 overflow-x-auto">
            {activeTab === "members" && <MembersTable />}
            {activeTab === "groups" && <GroupsTable />}
            {activeTab === "roles" && <RolesTable />}
          </div>
        </div>
      </div>

      <AddNewUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
      <AddNewGroupModal
        isOpen={isAddGroupModalOpen}
        onClose={() => setIsAddGroupModalOpen(false)}
      />
      <AddNewRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
      />
    </div>
  );
}
