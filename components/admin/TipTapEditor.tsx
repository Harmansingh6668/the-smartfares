"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Heading2, List, ListOrdered, LinkIcon, ImageIcon } from "lucide-react";
import { useEffect } from "react";

export function TipTapEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: defaultValue || "<p></p>",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const hiddenInput = document.getElementById(`${name}-hidden`) as HTMLInputElement | null;
    if (hiddenInput) hiddenInput.value = editor.getHTML();

    const update = () => {
      if (hiddenInput) hiddenInput.value = editor.getHTML();
    };
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor, name]);

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-surface p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
        >
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="prose prose-slate max-w-none px-4 py-3 [&_.ProseMirror]:min-h-[220px] [&_.ProseMirror]:outline-none" />
      <input type="hidden" id={`${name}-hidden`} name={name} defaultValue={defaultValue} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md p-1.5 ${active ? "bg-primary text-white" : "text-ink-muted hover:bg-white"}`}
    >
      {children}
    </button>
  );
}
