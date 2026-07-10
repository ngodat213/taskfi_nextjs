import { MoreHorizontal, Calendar, MapPin, Folder } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function MembersTable() {
  const members = [
    {
      name: "Dat Ngo",
      email: "datngo@taskfi.com",
      phone: "+84 987 654 321",
      location: "Ho Chi Minh, VN",
      joinedDate: "Jan 2024",
      projectsCount: 12,
      type: "Full-time",
      title: "Senior Frontend Engineer",
      department: "Engineering",
      role: "Workspace Admin",
      status: "Active",
      tags: ["React", "Next.js", "UI/UX"],
    },
    {
      name: "John Doe",
      email: "john@taskfi.com",
      phone: "+1 234 567 8900",
      location: "San Francisco, CA",
      joinedDate: "Mar 2024",
      projectsCount: 4,
      type: "Contractor",
      title: "Product Designer",
      department: "Design",
      role: "Member",
      status: "Active",
      tags: ["Figma", "Prototyping"],
    },
    {
      name: "Jane Smith",
      email: "jane@taskfi.com",
      phone: "+44 7700 900077",
      location: "London, UK",
      joinedDate: "Apr 2024",
      projectsCount: 2,
      type: "Full-time",
      title: "Marketing Specialist",
      department: "Marketing",
      role: "Viewer",
      status: "On Leave",
      tags: ["SEO", "Content", "Ads"],
    },
    {
      name: "Alex Johnson",
      email: "alex@taskfi.com",
      phone: "+61 412 345 678",
      location: "Sydney, AU",
      joinedDate: "Jun 2024",
      projectsCount: 0,
      type: "Part-time",
      title: "Backend Engineer",
      department: "Engineering",
      role: "Member",
      status: "Invited",
      tags: ["Node.js", "PostgreSQL"],
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead className="hidden md:table-cell">
            Position & Skills
          </TableHead>
          <TableHead className="hidden xl:table-cell">Details</TableHead>
          <TableHead className="hidden lg:table-cell">Role</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="w-8 text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((m, i) => (
          <TableRow key={i} className="group">
            {/* Employee Info */}
            <TableCell className="border-l-2 border-transparent group-hover:border-blue-500 transition-colors align-top md:align-middle">
              <div className="flex items-start md:items-center gap-3">
                <div className="mt-0.5 md:mt-0 w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-600 flex items-center justify-center text-[12.5px] font-bold shrink-0 border border-blue-200/60 shadow-sm ring-1 ring-transparent group-hover:ring-blue-100 transition-all">
                  {m.name.charAt(0)}
                </div>
                <div className="flex flex-col min-w-0 flex-1 w-full whitespace-normal">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[13px] font-semibold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors line-clamp-1">
                      {m.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-[1px] rounded bg-slate-100 text-slate-500 font-bold tracking-wider uppercase hidden lg:inline-block">
                      {m.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-[1px]">
                    <span className="text-[11.5px] text-slate-500 truncate">
                      {m.email}
                    </span>
                    <span className="text-slate-300 hidden xl:inline-block text-[10px]">
                      •
                    </span>
                    <span className="text-[11px] text-slate-400 truncate hidden xl:inline-block">
                      {m.phone}
                    </span>
                  </div>

                  {/* Mobile inline info */}
                  <div className="flex flex-col gap-2 mt-2.5 md:hidden w-full">
                    <span className="text-[12px] text-slate-700 font-medium">
                      {m.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      {m.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 border border-slate-200/60 text-slate-600 rounded-md text-[10.5px]"
                        >
                          {tag}
                        </span>
                      ))}
                      {m.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200/50 text-slate-500 rounded-md text-[10.5px]">
                          +{m.tags.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80">
                      <Badge
                        variant={
                          m.role === "Workspace Admin"
                            ? "purple"
                            : m.role === "Member"
                              ? "blue"
                              : "slate"
                        }
                      >
                        {m.role}
                      </Badge>
                      <Badge
                        dot
                        variant={
                          m.status === "Active"
                            ? "emerald"
                            : m.status === "Invited"
                              ? "amber"
                              : "slate"
                        }
                      >
                        {m.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TableCell>

            {/* Position & Skills */}
            <TableCell className="hidden md:table-cell align-top md:align-middle">
              <div className="flex flex-col">
                <span className="text-[12.5px] text-slate-800 font-medium">
                  {m.title}
                </span>
                <span className="text-[11.5px] text-slate-500">
                  {m.department}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {m.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-white border border-slate-200 shadow-sm text-slate-600 rounded text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </TableCell>

            {/* Details */}
            <TableCell className="hidden xl:table-cell align-top md:align-middle">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {m.location}
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {m.joinedDate}
                </div>
                <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                  <Folder className="w-3.5 h-3.5 text-slate-400" />
                  {m.projectsCount} active projects
                </div>
              </div>
            </TableCell>

            {/* Role */}
            <TableCell className="hidden lg:table-cell align-top md:align-middle">
              <div className="flex flex-col gap-1">
                <span className="text-[12.5px] text-slate-700 font-medium">
                  {m.role}
                </span>
                <span className="text-[11px] text-slate-400 hidden lg:block">
                  {m.role === "Workspace Admin"
                    ? "Full access"
                    : m.role === "Member"
                      ? "Can edit"
                      : "Can view"}
                </span>
              </div>
            </TableCell>

            {/* Status */}
            <TableCell className="hidden sm:table-cell align-top md:align-middle">
              <Badge
                dot
                variant={
                  m.status === "Active"
                    ? "emerald"
                    : m.status === "Invited"
                      ? "amber"
                      : "slate"
                }
              >
                {m.status}
              </Badge>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right align-top md:align-middle pr-4">
              <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-200/60 transition-all opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
