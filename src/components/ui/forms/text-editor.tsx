"use client";

import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextHTwo,
  List,
  ListNumbers,
  Code,
  TextAa,
} from "@phosphor-icons/react/dist/ssr";

import * as React from "react";
import { useState, useEffect } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight, all } from "lowlight";
import { cn } from "@/utils/cn";
import "@/styles/code-theme.css";

const lowlight = createLowlight(all);

export interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  rightAction?: React.ReactNode;
  collapsible?: boolean;
}

const MenuBar = ({
  editor,
  rightAction,
}: {
  editor: Editor | null;
  rightAction?: React.ReactNode;
}) => {
  if (!editor) {
    return null;
  }

  const toggleBtnClass = (isActive: boolean) =>
    cn(
      "p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground",
      isActive && "bg-border text-foreground",
    );

  return (
    <div className="flex items-center justify-between border-b border-border/40 px-2 py-1 bg-card/60">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toggleBtnClass(editor.isActive("bold"))}
          title="Bold (Ctrl+B)"
        >
          <TextB className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toggleBtnClass(editor.isActive("italic"))}
          title="Italic (Ctrl+I)"
        >
          <TextItalic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={toggleBtnClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <TextStrikethrough className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border/60 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toggleBtnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <TextHTwo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleBtnClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleBtnClass(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          <ListNumbers className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-border/60 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={toggleBtnClass(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      {rightAction && <div className="flex items-center">{rightAction}</div>}
    </div>
  );
};

export const TextEditor = React.forwardRef<HTMLDivElement, TextEditorProps>(
  (
    {
      value = "",
      onChange,
      onBlur,
      placeholder,
      className,
      rightAction,
      collapsible = false,
    },
    ref,
  ) => {
    const [isExpanded, setIsExpanded] = useState(!collapsible);

    useEffect(() => {
      if (!collapsible) {
        setIsExpanded(true);
      }
    }, [collapsible]);

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        CodeBlockLowlight.configure({
          lowlight,
        }),
        Placeholder.configure({
          placeholder: placeholder || "Write something...",
          emptyEditorClass:
            "cursor-text before:content-[attr(data-placeholder)] before:absolute before:text-slate-400 before:pointer-events-none before:h-0",
        }),
      ],
      content: value,
      onUpdate: ({ editor: ed }) => {
        onChange?.(ed.getHTML());
      },
      onBlur: () => {
        onBlur?.();
      },
      editorProps: {
        attributes: {
          class:
            "focus:outline-none min-h-[90px] p-3 text-[13px] text-muted-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-[var(--hljs-bg)] [&_pre]:text-[var(--hljs-fg)] [&_pre]:border [&_pre]:border-slate-200 dark:[&_pre]:border-slate-700/50 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto",
        },
      },
    });

    const handleExpand = () => {
      setIsExpanded(true);
      setTimeout(() => editor?.commands.focus(), 50);
    };

    if (collapsible && !isExpanded) {
      return (
        <div
          ref={ref}
          onClick={handleExpand}
          className={cn(
            "w-full bg-card hover:bg-muted/50 transition-colors rounded-xl border border-border/60 px-3.5 py-2 flex items-center justify-between gap-3 cursor-pointer group shadow-2xs",
            className,
          )}
        >
          <span className="text-[13px] text-muted-foreground font-normal truncate flex-1 min-w-0">
            {placeholder || "Add a comment..."}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleExpand();
              }}
              className="p-1 rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-muted transition-colors"
              title="Formatting & Rich Editor"
            >
              <TextAa className="w-4 h-4" />
            </button>
            {rightAction}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-card transition-colors rounded-xl border border-border/60 focus-within:border-primary/50 flex flex-col overflow-hidden shadow-2xs",
          className,
        )}
      >
        <MenuBar editor={editor} rightAction={rightAction} />
        <EditorContent editor={editor} className="flex-1 cursor-text" />
      </div>
    );
  },
);

TextEditor.displayName = "TextEditor";
