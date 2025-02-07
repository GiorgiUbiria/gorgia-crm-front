import React, { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import * as Toolbar from "@radix-ui/react-toolbar"
import {
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
  Link2Icon,
  HeadingIcon,
  TextIcon,
  ListBulletIcon,
  MinusIcon,
} from "@radix-ui/react-icons"

const RichTextEditor = ({ value, onChange, placeholder, disabled }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 hover:text-blue-700 underline",
        },
      }),
      Underline,
    ],
    content: value
      ? typeof value === "string"
        ? JSON.parse(value)
        : value
      : "",
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange({ target: { value: JSON.stringify(json) } })
    },
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none w-full min-h-[100px] px-4 py-3 rounded-b-lg border border-t-0 border-gray-300 dark:!border-gray-600 dark:!bg-gray-700 dark:!text-gray-200 focus:border-[#105D8D] focus:ring-1 focus:ring-[#105D8D] focus:outline-none transition-colors resize-none placeholder:text-gray-400 dark:!placeholder:text-gray-500",
      },
    },
  })

  useEffect(() => {
    if (editor && value !== undefined) {
      const newContent = value
        ? typeof value === "string"
          ? JSON.parse(value)
          : value
        : ""
      const currentContent = editor.getJSON()

      if (JSON.stringify(currentContent) !== JSON.stringify(newContent)) {
        editor.commands.setContent(newContent)
      }
    }
  }, [value, editor])

  const setLink = () => {
    const url = window.prompt("URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <Toolbar.Root className="flex w-full min-w-max rounded-t-lg bg-gray-50 dark:!bg-gray-800 p-2 border border-gray-300 dark:!border-gray-600">
        <Toolbar.ToggleGroup
          type="multiple"
          aria-label="Text formatting"
          className="flex gap-1"
        >
          {/* Text Formatting */}
          <Toolbar.ToggleItem
            className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
              editor.isActive("bold") ? "bg-[#105D8D] text-white" : ""
            }`}
            value="bold"
            aria-label="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FontBoldIcon className="dark:!text-gray-200" />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
              editor.isActive("italic") ? "bg-[#105D8D] text-white" : ""
            }`}
            value="italic"
            aria-label="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FontItalicIcon className="dark:!text-gray-200" />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
              editor.isActive("underline") ? "bg-[#105D8D] text-white" : ""
            }`}
            value="underline"
            aria-label="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="dark:!text-gray-200" />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* Colors */}
        <select
          className="h-8 rounded border border-gray-300 dark:!border-gray-600 bg-white dark:!bg-gray-700 dark:!text-gray-200 px-2 focus:outline-none focus:ring-2 focus:ring-[#105D8D]"
          value={editor.getAttributes("textStyle").color || "black"}
          onChange={e => editor.chain().focus().setColor(e.target.value).run()}
          disabled={disabled}
        >
          <option value="black">შავი</option>
          <option value="#105D8D">ლურჯი</option>
          <option value="#22C55E">მწვანე</option>
          <option value="#EF4444">წითელი</option>
        </select>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* Highlight Colors */}
        <select
          className="h-8 rounded border border-gray-300 dark:!border-gray-600 bg-white dark:!bg-gray-700 dark:!text-gray-200 px-2 focus:outline-none focus:ring-2 focus:ring-[#105D8D]"
          value={editor.getAttributes("highlight").color || ""}
          onChange={e =>
            editor
              .chain()
              .focus()
              .toggleHighlight({ color: e.target.value })
              .run()
          }
          disabled={disabled}
        >
          <option value="">No Highlight</option>
          <option value="#ffcc00">Yellow</option>
          <option value="#a2d2ff">Blue</option>
          <option value="#ffd6d6">Red</option>
          <option value="#d0f4de">Green</option>
        </select>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* Link */}
        <Toolbar.Button
          className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
            editor.isActive("link") ? "bg-[#105D8D] text-white" : ""
          }`}
          onClick={setLink}
          disabled={disabled}
        >
          <Link2Icon className="dark:!text-gray-200" />
        </Toolbar.Button>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* Headings */}
        <Toolbar.ToggleGroup type="single" aria-label="Heading">
          <Toolbar.ToggleItem
            className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
              editor.isActive("heading", { level: 1 })
                ? "bg-[#105D8D] text-white"
                : ""
            }`}
            value="h1"
            aria-label="Heading 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <HeadingIcon className="dark:!text-gray-200" />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
              editor.isActive("heading", { level: 2 })
                ? "bg-[#105D8D] text-white"
                : ""
            }`}
            value="h2"
            aria-label="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <TextIcon className="dark:!text-gray-200" />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* List */}
        <Toolbar.Button
          className={`inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D] ${
            editor.isActive("bulletList") ? "bg-[#105D8D] text-white" : ""
          }`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <ListBulletIcon className="dark:!text-gray-200" />
        </Toolbar.Button>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300 dark:!bg-gray-600" />

        {/* Horizontal Rule */}
        <Toolbar.Button
          className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 dark:!hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#105D8D]"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
        >
          <MinusIcon className="dark:!text-gray-200" />
        </Toolbar.Button>
      </Toolbar.Root>

      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}

export default React.memo(RichTextEditor)
