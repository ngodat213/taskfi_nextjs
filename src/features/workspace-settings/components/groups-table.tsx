import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export function GroupsTable() {
  const groups = [
    {
      name: "Frontend Team",
      members: 12,
      desc: "UI/UX and frontend engineering",
    },
    { name: "Backend Team", members: 8, desc: "API and database engineering" },
    {
      name: "Designers",
      members: 4,
      desc: "Product designers and researchers",
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Group Name</TableHead>
          <TableHead className="hidden sm:table-cell">Members</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((g, i) => (
          <TableRow key={i} className="group">
            <TableCell>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-slate-800">
                  {g.name}
                </span>
                <span className="text-[12px] text-slate-500">{g.desc}</span>
                <span className="text-[11px] text-slate-500 mt-1 sm:hidden">
                  {g.members} members
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="text-[13px] text-slate-600">{g.members}</span>
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
