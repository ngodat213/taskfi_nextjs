"use client";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextHTwo,
  List,
  ListNumbers,
  Code,
} from "@phosphor-icons/react/dist/ssr";

import * as React from "react";
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
  collapsible?: boolean;
  rightAction?: React.ReactNode;
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
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 p-2 bg-muted/80 rounded-b-lg">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={toggleBtnClass(editor.isActive("bold"))}
          title="Bold"
        >
          <TextB size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={toggleBtnClass(editor.isActive("italic"))}
          title="Italic"
        >
          <TextItalic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={toggleBtnClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <TextStrikethrough size={16} />
        </button>

        <div className="w-px h-5 bg-border mx-1 self-center" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={toggleBtnClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <TextHTwo size={16} />
        </button>

        <div className="w-px h-5 bg-border mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toggleBtnClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toggleBtnClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListNumbers size={16} />
        </button>

        <div className="w-px h-5 bg-border mx-1 self-center" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={toggleBtnClass(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          <Code size={16} />
        </button>
      </div>

      {rightAction && (
        <div className="flex items-center gap-2">{rightAction}</div>
      )}
    </div>
  );
};

export const TextEditor = React.forwardRef<HTMLDivElement, TextEditorProps>(
  ({ className, value, onChange, onBlur, placeholder, rightAction }, ref) => {
    const editor = useEditor({
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
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
      onBlur: () => {
        onBlur?.();
      },
      editorProps: {
        attributes: {
          class:
            "focus:outline-none min-h-[120px] p-3 text-[13px] text-muted-foreground leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2:first-child]:mt-0 [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 [&_strong]:font-bold [&_em]:italic [&_pre]:bg-[var(--hljs-bg)] [&_pre]:text-[var(--hljs-fg)] [&_pre]:border [&_pre]:border-slate-200 dark:[&_pre]:border-slate-700/50 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:my-2 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto",
        },
      },
    });

    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-muted/30 transition-colors rounded-lg border border-border/60 focus-within:border-blue-500 flex flex-col overflow-hidden",
          className,
        )}
      >
        <EditorContent editor={editor} className="flex-1 cursor-text" />
        <MenuBar editor={editor} rightAction={rightAction} />
      </div>
    );
  },
);
TextEditor.displayName = "TextEditor";
