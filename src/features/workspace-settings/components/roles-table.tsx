import { MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export function RolesTable() {
  const roles = [
    {
      name: "Workspace Admin",
      type: "System",
      desc: "Full access to all settings and billing",
    },
    {
      name: "Project Manager",
      type: "Custom",
      desc: "Can create projects and manage members",
    },
    {
      name: "Member",
      type: "System",
      desc: "Can view and edit assigned tasks",
    },
    { name: "Viewer", type: "System", desc: "Read-only access" },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((r, i) => (
          <TableRow key={i} className="group">
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-slate-800">
                  {r.name}
                </span>
                <span className="text-[12px] text-slate-500">{r.desc}</span>
                <span className="text-[11px] px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 text-slate-600 rounded-md w-fit mt-1 sm:hidden">
                  {r.type}
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium",
                  r.type === "System"
                    ? "bg-blue-50 text-blue-700 border-blue-100"
                    : "bg-purple-50 text-purple-700 border-purple-100",
                )}
              >
                {r.type}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <button className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
