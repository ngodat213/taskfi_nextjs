"use client";

import { FileTextIcon, FolderSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-display/table";
import { DocumentItem } from "@/features/documents/types/documents.types";

import { DocumentCard } from "./document-card";

interface DocumentListSectionProps {
  title: string;
  count: number;
  docs: DocumentItem[];
  viewMode: "grid" | "list";
  onToggleStar: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DocumentListSection({
  title,
  count,
  docs,
  viewMode,
  onToggleStar,
  emptyTitle = "No Documents Match",
  emptyDescription = "No files match your current search or category filter.",
}: DocumentListSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-bold text-foreground capitalize flex items-center gap-2">
          <FileTextIcon className="w-4 h-4 text-blue-500" />
          <span>{title}</span>
          <span className="text-muted-foreground font-medium text-[12px] ml-0.5">
            ({count})
          </span>
        </h3>
      </div>

      <AnimatePresence mode="wait">
        {docs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-14 text-center text-muted-foreground bg-card/40 border border-border/60 rounded-2xl"
          >
            <FolderSimpleIcon className="w-12 h-12 mb-2.5 opacity-30 text-primary" />
            <h4 className="text-[14.5px] font-semibold text-foreground">
              {emptyTitle}
            </h4>
            <p className="text-[12.5px] text-muted-foreground mt-1 max-w-sm">
              {emptyDescription}
            </p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {docs.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                viewMode="grid"
                onToggleStar={onToggleStar}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col w-full"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4">Document Title</TableHead>
                  <TableHead className="w-30">Category</TableHead>
                  <TableHead>Format & Size</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="w-20 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    doc={doc}
                    viewMode="list"
                    onToggleStar={onToggleStar}
                  />
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
