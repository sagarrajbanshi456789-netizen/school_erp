// src/components/book-editor/TipTapEditor.tsx
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"

type Props = {
  value: string
  onChange: (value: string) => void
}

export default function TipTapEditor({ value, onChange }: Props) {
  const editor = useEditor({
     immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "flex-1 w-full h-full p-4 outline-none prose dark:prose-invert max-w-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  // sync external value (important for page switching)
  useEffect(() => {
    if (!editor) return

    const current = editor.getHTML()
    if (value !== current) {
         editor.commands.setContent(value, {
        emitUpdate: false, // ✅ correct way (NOT false)
      })
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="flex-1 overflow-auto bg-background">
      <EditorContent editor={editor} />
    </div>
  )
}