"use client";

import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  FolderSimpleIcon,
  FilesIcon,
  UserIcon,
  CaretLeftIcon,
} from "@phosphor-icons/react/dist/ssr";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
  ModalFooter,
} from "@/components/ui/layout/modal";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/data-display/table";
import {
  MOCK_DOCUMENTS,
  MOCK_FOLDERS,
} from "@/features/documents/mocks/documents.mocks";
import { DocumentItem } from "@/features/documents/types/documents.types";
import {
  getFolderColorStyle,
  getFileTypeStyle,
} from "@/features/documents/utils/documents.utils";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/data-display/avatar";

interface DocumentPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDocuments: (selectedDocs: DocumentItem[]) => void;
  alreadySelectedIds?: string[];
}

export function DocumentPickerModal({
  isOpen,
  onClose,
  onSelectDocuments,
  alreadySelectedIds = [],
}: DocumentPickerModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<"all" | "team" | "project">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocIds, setSelectedDocIds] =
    useState<string[]>(alreadySelectedIds);

  const activeFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return MOCK_FOLDERS.find((f) => f.id === currentFolderId) || null;
  }, [currentFolderId]);

  const filteredFolders = useMemo(() => {
    if (folderFilter === "team") {
      return MOCK_FOLDERS.filter((f) => f.groupType === "team");
    }
    if (folderFilter === "project") {
      return MOCK_FOLDERS.filter((f) => f.groupType === "project");
    }
    return MOCK_FOLDERS;
  }, [folderFilter]);

  const displayedItems = useMemo(() => {
    const isSearching = searchQuery.trim().length > 0;

    if (isSearching) {
      const q = searchQuery.toLowerCase();
      const docs = MOCK_DOCUMENTS.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q),
      );
      return { isSearching: true, folders: [], documents: docs };
    }

    if (currentFolderId === null) {
      const rootDocs = MOCK_DOCUMENTS.filter((doc) => !doc.folderId);
      return {
        isSearching: false,
        folders: filteredFolders,
        documents: rootDocs,
      };
    }

    const folderDocs = MOCK_DOCUMENTS.filter(
      (doc) => doc.folderId === currentFolderId,
    );
    return { isSearching: false, folders: [], documents: folderDocs };
  }, [searchQuery, currentFolderId, filteredFolders]);

  const toggleSelectDoc = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleConfirm = () => {
    const selectedDocs = MOCK_DOCUMENTS.filter((d) =>
      selectedDocIds.includes(d.id),
    );
    onSelectDocuments(selectedDocs);
    onClose();
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    setSearchQuery("");
  };

  const handleGoBack = () => {
    if (currentFolderId !== null) {
      setCurrentFolderId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent className="max-w-4xl h-160 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <ModalHeader
          title="FILE EXPLORER • DOCUMENT LIBRARY"
          icon={
            <FolderSimpleIcon
              className="w-4 h-4 text-primary"
              weight="duotone"
            />
          }
        />

        {/* Modal Body */}
        <ModalBody className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <ModalScrollArea
            className="flex-1 h-full overflow-y-auto custom-scrollbar"
            title={activeFolder ? activeFolder.name : "Project Documents"}
            description={
              activeFolder
                ? `Browsing ${activeFolder.fileCount} files in ${activeFolder.name}`
                : "Browse project folders and files to attach to task"
            }
          >
            {/* Top Navigation & Search Bar */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex items-center gap-3">
                {/* Back Button & Active Folder Title */}
                <div className="flex-1 flex items-center gap-2.5">
                  {(currentFolderId !== null || displayedItems.isSearching) && (
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="p-1.5 rounded-lg border border-border/60 bg-secondary hover:bg-secondary/80 text-foreground transition-all flex items-center justify-center shrink-0 cursor-pointer"
                      title="Go back"
                    >
                      <CaretLeftIcon className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-sm font-bold text-foreground truncate">
                    {displayedItems.isSearching
                      ? "Search Results"
                      : activeFolder
                        ? activeFolder.name
                        : "All Documents"}
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative w-48 sm:w-64 shrink-0">
                  <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-xs bg-secondary border border-border/60 rounded-xl focus:outline-none focus:border-primary focus:bg-card transition-colors placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Folders Section (Exact Documents Page Table Design) */}
            {displayedItems.folders.length > 0 && (
              <div className="flex flex-col gap-2.5 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderSimpleIcon
                      className="w-4 h-4 text-primary"
                      weight="duotone"
                    />
                    <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Folders ({displayedItems.folders.length})
                    </span>
                  </div>

                  {/* Filter Pills: All Folders | By Team | By Project */}
                  <div className="flex items-center gap-1 bg-secondary/80 p-0.5 rounded-lg border border-border/50 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFolderFilter("all")}
                      className={cn(
                        "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1",
                        folderFilter === "all"
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <FolderSimpleIcon className="w-3 h-3" />
                      <span>All Folders</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFolderFilter("team")}
                      className={cn(
                        "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1",
                        folderFilter === "team"
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span>By Team</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFolderFilter("project")}
                      className={cn(
                        "px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1",
                        folderFilter === "project"
                          ? "bg-card text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span>By Project</span>
                    </button>
                  </div>
                </div>

                {/* Folders Table */}
                <div className="rounded-xl border border-border/80 overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-[35%] text-[11px] font-bold text-muted-foreground">
                          Folder Name
                        </TableHead>
                        <TableHead className="w-[15%] text-[11px] font-bold text-muted-foreground">
                          Type
                        </TableHead>
                        <TableHead className="w-[25%] text-[11px] font-bold text-muted-foreground">
                          Target Team / Project
                        </TableHead>
                        <TableHead className="w-[15%] text-[11px] font-bold text-muted-foreground">
                          File Count
                        </TableHead>
                        <TableHead className="w-[10%] text-[11px] font-bold text-muted-foreground">
                          Owner
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedItems.folders.map((folder) => {
                        const colorStyle = getFolderColorStyle(folder.color);

                        return (
                          <TableRow
                            key={folder.id}
                            onClick={() => handleOpenFolder(folder.id)}
                            className="group cursor-pointer transition-colors hover:bg-secondary/40"
                          >
                            {/* Folder Name & Icon */}
                            <TableCell className="align-middle px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    "w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-3xs group-hover:scale-105 transition-transform duration-200",
                                    colorStyle.iconBg,
                                  )}
                                >
                                  <FolderSimpleIcon
                                    className="w-4 h-4"
                                    weight="duotone"
                                  />
                                </div>
                                <span className="text-[12.5px] font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
                                  {folder.name}
                                </span>
                              </div>
                            </TableCell>

                            {/* Type Pill */}
                            <TableCell className="align-middle">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-extrabold uppercase tracking-wider border shrink-0",
                                  folder.groupType === "team"
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                    : "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                                )}
                              >
                                <span
                                  className={cn(
                                    "w-1 h-1 rounded-full",
                                    folder.groupType === "team"
                                      ? "bg-blue-500"
                                      : "bg-purple-500",
                                  )}
                                />
                                {folder.groupType === "team"
                                  ? "TEAM"
                                  : "PROJECT"}
                              </span>
                            </TableCell>

                            {/* Target Team / Project */}
                            <TableCell className="align-middle text-[12px] text-muted-foreground font-medium">
                              {folder.teamName || folder.projectName}
                            </TableCell>

                            {/* File Count */}
                            <TableCell className="align-middle">
                              <div className="flex items-center gap-1 text-[11.5px] text-muted-foreground">
                                <FilesIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-semibold text-foreground">
                                  {folder.fileCount} files
                                </span>
                              </div>
                            </TableCell>

                            {/* Owner */}
                            <TableCell className="align-middle">
                              <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                                <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="truncate">{folder.owner}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Files Section (Exact Documents Page Table Design) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Files ({displayedItems.documents.length})
                </span>
              </div>

              {displayedItems.documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border border-border/80 rounded-xl bg-card">
                  <p className="text-xs font-medium">
                    No files found in this section
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-border/80 overflow-hidden bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="w-10 text-center" />
                        <TableHead className="w-[40%] text-[11px] font-bold text-muted-foreground">
                          File Name
                        </TableHead>
                        <TableHead className="w-[20%] text-[11px] font-bold text-muted-foreground">
                          Category
                        </TableHead>
                        <TableHead className="w-[12%] text-[11px] font-bold text-muted-foreground">
                          Size
                        </TableHead>
                        <TableHead className="w-[18%] text-[11px] font-bold text-muted-foreground">
                          Author
                        </TableHead>
                        <TableHead className="w-[10%] text-[11px] font-bold text-muted-foreground">
                          Updated
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedItems.documents.map((doc) => {
                        const isSelected = selectedDocIds.includes(doc.id);
                        const typeStyle = getFileTypeStyle(doc.type);
                        const FileTypeIcon = typeStyle.icon;

                        return (
                          <TableRow
                            key={doc.id}
                            onClick={() => toggleSelectDoc(doc.id)}
                            className={cn(
                              "group cursor-pointer transition-colors hover:bg-secondary/40 select-none",
                              isSelected ? "bg-primary/5" : "",
                            )}
                          >
                            {/* Checkbox */}
                            <TableCell className="align-middle text-center px-3 py-2.5">
                              <div
                                onClick={(e) => toggleSelectDoc(doc.id, e)}
                                className={cn(
                                  "w-4.5 h-4.5 rounded border flex items-center justify-center transition-all cursor-pointer mx-auto",
                                  isSelected
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "border-border bg-card group-hover:border-primary/50",
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon className="w-3 h-3 stroke-3" />
                                )}
                              </div>
                            </TableCell>

                            {/* File Name & Icon */}
                            <TableCell className="align-middle px-4 py-2.5">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={cn(
                                    "w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 border shadow-3xs",
                                    typeStyle.style,
                                  )}
                                >
                                  <FileTypeIcon className="w-4 h-4" />
                                </div>
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[12.5px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                    {doc.title}
                                  </span>
                                  <span className="text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0 border border-border/40">
                                    {doc.extension}
                                  </span>
                                </div>
                              </div>
                            </TableCell>

                            {/* Category */}
                            <TableCell className="align-middle">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-secondary text-muted-foreground border border-border/40">
                                {doc.category}
                              </span>
                            </TableCell>

                            {/* Size */}
                            <TableCell className="align-middle font-mono text-[11px] text-muted-foreground">
                              {doc.size}
                            </TableCell>

                            {/* Author */}
                            <TableCell className="align-middle">
                              <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                                <Avatar
                                  fallback={doc.author.name}
                                  size="sm"
                                  className={cn(
                                    "text-[9px]",
                                    doc.author.avatarBg,
                                  )}
                                />
                                <span className="truncate">
                                  {doc.author.name}
                                </span>
                              </div>
                            </TableCell>

                            {/* Updated */}
                            <TableCell className="align-middle text-[11px] text-muted-foreground">
                              {doc.updatedAt}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ModalScrollArea>
        </ModalBody>

        {/* Standard Modal Footer */}
        <ModalFooter className="justify-between">
          <div className="text-xs font-medium text-muted-foreground">
            {selectedDocIds.length > 0 ? (
              <span className="text-foreground font-semibold">
                {selectedDocIds.length} document
                {selectedDocIds.length > 1 ? "s" : ""} selected
              </span>
            ) : (
              "Click folder row to navigate • Check file row to select"
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={ButtonVariant.Outline}
              size={ButtonSize.Sm}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant={ButtonVariant.Primary}
              size={ButtonSize.Sm}
              onClick={handleConfirm}
              disabled={selectedDocIds.length === 0}
            >
              Attach{" "}
              {selectedDocIds.length > 0 ? `(${selectedDocIds.length})` : ""}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
