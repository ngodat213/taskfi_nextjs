"use client";

import { useState, useMemo } from "react";
import {
  MagnifyingGlass,
  Star,
  SquaresFour,
  ListBullets,
  UploadSimple,
  FolderSimple,
  UsersThree,
  Kanban,
  Plus,
} from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/ui/layout/page-header";
import { Input } from "@/components/ui/forms/input";
import {
  Button,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import {
  SegmentedControl,
  SegmentedControlTab,
} from "@/components/ui/forms/segmented-control";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
} from "@/components/ui/data-display/table";

import {
  DocumentItem,
  FolderItem,
} from "@/features/documents/types/documents.types";
import { DOCUMENT_CATEGORIES } from "@/features/documents/constants/documents.constants";
import {
  MOCK_DOCUMENTS,
  MOCK_FOLDERS,
} from "@/features/documents/mocks/documents.mocks";
import { FolderCard } from "./folder-card";
import { DocumentListSection } from "./document-list-section";
import { TAB_CONTENT_VARIANTS } from "@/constants/animations";
import { useNavigationStore } from "@/store/navigation.store";

import { useUserStore } from "@/store/user.store";

const VIEW_MODE_TABS: SegmentedControlTab[] = [
  { id: "grid", label: "Grid", icon: SquaresFour },
  { id: "list", label: "List", icon: ListBullets },
];

const FOLDER_TAB_OPTIONS: SegmentedControlTab[] = [
  { id: "all", label: "All Folders", icon: FolderSimple },
  { id: "team", label: "By Team", icon: UsersThree },
  { id: "project", label: "By Project", icon: Kanban },
];

interface DedicatedFolderViewProps {
  selectedFolderObj: FolderItem;
  q: string;
  setQ: (val: string) => void;
  onlyStarred: boolean;
  setOnlyStarred: (val: boolean) => void;
  viewMode: "grid" | "list";
  setViewMode: (val: "grid" | "list") => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  filteredDocs: DocumentItem[];
  handleToggleStar: (id: string) => void;
}

function DedicatedFolderView({
  selectedFolderObj,
  q,
  setQ,
  onlyStarred,
  setOnlyStarred,
  viewMode,
  setViewMode,
  selectedCategory,
  setSelectedCategory,
  filteredDocs,
  handleToggleStar,
}: DedicatedFolderViewProps) {
  return (
    <motion.div
      key={`folder-screen-${selectedFolderObj.id}`}
      variants={TAB_CONTENT_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex-1 w-full flex flex-col overflow-hidden"
    >
      {/* Top Header Section with Folder Title */}
      <div className="bg-transparent border-b border-border/60 shrink-0">
        <div className="w-full px-4 sm:px-6 md:px-8 pt-5 pb-4">
          <PageHeader
            title={
              <div className="flex items-center gap-2.5">
                <FolderSimple
                  className="w-6 h-6 text-blue-500 shrink-0"
                  weight="duotone"
                />
                <span>{selectedFolderObj.name}</span>
              </div>
            }
            description={
              selectedFolderObj.teamName ||
              selectedFolderObj.projectName ||
              "Folder repository and documents"
            }
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant={ButtonVariant.Primary}
                  size={ButtonSize.Sm}
                  className="gap-1.5 text-[12px]"
                >
                  <UploadSimple className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Upload to Folder
                </Button>
              </div>
            }
          />
        </div>
      </div>

      {/* Folder Files Body Content */}
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-5 overflow-y-auto flex flex-col gap-5">
        {/* Filter Controls Row inside Folder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={`Search files in ${selectedFolderObj.name}...`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 text-[12.5px]"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOnlyStarred(!onlyStarred)}
              className={cn(
                "px-3 py-1 rounded-xl text-[12px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer",
                onlyStarred
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  : "bg-secondary/70 text-muted-foreground border-border/60 hover:text-foreground",
              )}
            >
              <Star
                className={cn(
                  "w-3.5 h-3.5",
                  onlyStarred ? "fill-amber-500 text-amber-500" : "",
                )}
              />
              <span>Starred Only</span>
            </button>

            <SegmentedControl
              tabs={VIEW_MODE_TABS}
              activeTab={viewMode}
              onTabChange={(id) => setViewMode(id as "grid" | "list")}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {DOCUMENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-[12px] font-medium border shrink-0 transition-colors cursor-pointer",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-secondary/70 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Reusable Document List Section */}
        <DocumentListSection
          title={`${selectedFolderObj.name} Files`}
          count={filteredDocs.length}
          docs={filteredDocs}
          viewMode={viewMode}
          onToggleStar={handleToggleStar}
          emptyTitle={`No Files Found in ${selectedFolderObj.name}`}
        />
      </div>
    </motion.div>
  );
}

export function DocumentsView() {
  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [folderTab, setFolderTab] = useState<"all" | "team" | "project">("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const viewMode = useUserStore((state) => state.preferences.documentsViewMode);
  const setViewMode = useUserStore((state) => state.setDocumentsViewMode);
  const onlyStarred = useUserStore(
    (state) => state.preferences.documentsStarredOnly,
  );
  const setOnlyStarred = useUserStore((state) => state.setDocumentsStarredOnly);

  const [docsList, setDocsList] = useState<DocumentItem[]>(MOCK_DOCUMENTS);

  const stack = useNavigationStore((state) => state.stack);
  const pushNav = useNavigationStore((state) => state.push);

  const activeDocNav = useMemo(() => {
    return stack.find((item) => item.backLink === "/docs");
  }, [stack]);

  const effectiveFolderId = activeDocNav ? selectedFolderId : null;

  const selectedFolderObj = useMemo(() => {
    if (!effectiveFolderId) return null;
    return MOCK_FOLDERS.find((f) => f.id === effectiveFolderId) || null;
  }, [effectiveFolderId]);

  const handleToggleStar = (id: string) => {
    setDocsList((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, starred: !doc.starred } : doc,
      ),
    );
  };

  const handleOpenFolder = (id: string) => {
    const folder = MOCK_FOLDERS.find((f) => f.id === id);
    setSelectedFolderId(id);
    if (folder) {
      pushNav({
        name: folder.name,
        description: folder.teamName || folder.projectName,
        backLink: "/docs",
      });
    }
  };

  const filteredFolders = useMemo(() => {
    if (folderTab === "all") return MOCK_FOLDERS;
    return MOCK_FOLDERS.filter((f) => f.groupType === folderTab);
  }, [folderTab]);

  const filteredDocs = useMemo(() => {
    return docsList.filter((doc) => {
      const matchesSearch =
        doc.title.toLowerCase().includes(q.toLowerCase()) ||
        doc.description.toLowerCase().includes(q.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || doc.category === selectedCategory;
      const matchesFolder =
        !effectiveFolderId || doc.folderId === effectiveFolderId;
      const matchesStarred = !onlyStarred || doc.starred;

      return (
        matchesSearch && matchesCategory && matchesFolder && matchesStarred
      );
    });
  }, [docsList, q, selectedCategory, effectiveFolderId, onlyStarred]);

  return (
    <PageContainer>
      <AnimatePresence mode="wait">
        {selectedFolderObj ? (
          <DedicatedFolderView
            selectedFolderObj={selectedFolderObj}
            q={q}
            setQ={setQ}
            onlyStarred={onlyStarred}
            setOnlyStarred={setOnlyStarred}
            viewMode={viewMode}
            setViewMode={setViewMode}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            filteredDocs={filteredDocs}
            handleToggleStar={handleToggleStar}
          />
        ) : (
          <motion.div
            key="main-overview-screen"
            variants={TAB_CONTENT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 w-full flex flex-col overflow-hidden"
          >
            {/* Top Header Section */}
            <div className="bg-transparent border-b border-border/60 shrink-0">
              <div className="w-full px-4 sm:px-6 md:px-8 pt-5">
                <PageHeader
                  title="Documents & Knowledge Base"
                  description="Central repository for team specifications, design guidelines, release notes, and attachments."
                  actions={
                    <div className="flex items-center gap-2">
                      <Button
                        variant={ButtonVariant.Outline}
                        size={ButtonSize.Sm}
                        className="gap-1.5 text-[12px]"
                      >
                        <Plus className="w-3.5 h-3.5" /> New Folder
                      </Button>
                      <Button
                        variant={ButtonVariant.Primary}
                        size={ButtonSize.Sm}
                        className="gap-1.5 text-[12px]"
                      >
                        <UploadSimple
                          className="w-3.5 h-3.5"
                          strokeWidth={2.5}
                        />
                        Upload Document
                      </Button>
                    </div>
                  }
                >
                  <div className="flex flex-col gap-4 mb-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {DOCUMENT_CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                              "px-3 py-1 rounded-full text-[12px] font-medium border shrink-0 transition-colors cursor-pointer",
                              selectedCategory === cat
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary/70 text-muted-foreground border-border/60 hover:text-foreground hover:bg-secondary",
                            )}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setOnlyStarred(!onlyStarred)}
                          className={cn(
                            "px-3 py-1 rounded-xl text-[12px] font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer",
                            onlyStarred
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-secondary/70 text-muted-foreground border-border/60 hover:text-foreground",
                          )}
                        >
                          <Star
                            className={cn(
                              "w-3.5 h-3.5",
                              onlyStarred
                                ? "fill-amber-500 text-amber-500"
                                : "",
                            )}
                          />
                          <span>Starred Only</span>
                        </button>

                        <SegmentedControl
                          tabs={VIEW_MODE_TABS}
                          activeTab={viewMode}
                          onTabChange={(id) =>
                            setViewMode(id as "grid" | "list")
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 max-w-md">
                        <MagnifyingGlass className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          type="text"
                          placeholder="Search documents by title or description..."
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          className="w-full h-8.5 pl-8.5 pr-3 text-[12.5px]"
                        />
                      </div>
                      <span className="text-[12px] text-muted-foreground font-medium">
                        Showing {filteredDocs.length} of {docsList.length} docs
                      </span>
                    </div>
                  </div>
                </PageHeader>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-5 overflow-y-auto flex flex-col gap-7">
              {/* Section 1: Folder Explorer */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-[14px] font-bold text-foreground capitalize flex items-center gap-2">
                    <FolderSimple className="w-4 h-4 text-blue-500" />
                    <span>Folders</span>
                    <span className="text-muted-foreground font-medium text-[12px] ml-0.5">
                      ({filteredFolders.length})
                    </span>
                  </h3>

                  <SegmentedControl
                    tabs={FOLDER_TAB_OPTIONS}
                    activeTab={folderTab}
                    onTabChange={(id) =>
                      setFolderTab(id as "all" | "team" | "project")
                    }
                  />
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {filteredFolders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        isSelected={folder.id === effectiveFolderId}
                        viewMode="grid"
                        onSelect={(id) => handleOpenFolder(id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border/60 rounded-lg shadow-sm overflow-hidden flex flex-col w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-4">Folder Name</TableHead>
                          <TableHead className="w-30">Type</TableHead>
                          <TableHead>Target Team / Project</TableHead>
                          <TableHead>File Count</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead className="w-12 text-right" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredFolders.map((folder) => (
                          <FolderCard
                            key={folder.id}
                            folder={folder}
                            isSelected={folder.id === effectiveFolderId}
                            viewMode="list"
                            onSelect={(id) => handleOpenFolder(id)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* Section 2: All Documents Grid / List View */}
              <DocumentListSection
                title="Recent & All Documents"
                count={filteredDocs.length}
                docs={filteredDocs}
                viewMode={viewMode}
                onToggleStar={handleToggleStar}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
