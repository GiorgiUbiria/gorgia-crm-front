import React, { useState, useEffect, useRef } from "react"
import * as Toolbar from "@radix-ui/react-toolbar"
import { FontBoldIcon, FontItalicIcon } from "@radix-ui/react-icons"

const RichTextEditor = ({ value, onChange, placeholder, disabled }) => {
  const [content, setContent] = useState([
    {
      text: "",
      format: {
        bold: false,
        italic: false,
        color: "black",
        fontSize: "normal",
      },
    },
  ])
  const [selection, setSelection] = useState(null)
  const skipNextUpdate = useRef(false)

  // Update content when value prop changes
  useEffect(() => {
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false
      return
    }

    try {
      if (!value) {
        setContent([
          {
            text: "",
            format: {
              bold: false,
              italic: false,
              color: "black",
              fontSize: "normal",
            },
          },
        ])
        return
      }

      const parsed = typeof value === "string" ? JSON.parse(value) : value

      if (Array.isArray(parsed)) {
        setContent(parsed)
      } else if (typeof parsed === "object" && parsed.text) {
        setContent([
          {
            text: parsed.text,
            format: parsed.format || {
              bold: false,
              italic: false,
              color: "black",
              fontSize: "normal",
            },
          },
        ])
      } else {
        setContent([
          {
            text: String(parsed),
            format: {
              bold: false,
              italic: false,
              color: "black",
              fontSize: "normal",
            },
          },
        ])
      }
    } catch (e) {
      setContent([
        {
          text: String(value),
          format: {
            bold: false,
            italic: false,
            color: "black",
            fontSize: "normal",
          },
        },
      ])
    }
  }, [value])

  const handleTextChange = e => {
    const newText = e.target.value
    const segments = []
    let currentPosition = 0

    // Reconstruct segments based on the new text
    content.forEach(segment => {
      const segmentLength = segment.text.length
      if (currentPosition >= newText.length) return

      // Get the portion of new text that corresponds to this segment
      const newSegmentText = newText.slice(
        currentPosition,
        currentPosition + segmentLength
      )

      if (newSegmentText) {
        segments.push({
          text: newSegmentText,
          format: { ...segment.format },
        })
      }

      currentPosition += segmentLength
    })

    // If there's remaining text, add it as a new segment
    if (currentPosition < newText.length) {
      segments.push({
        text: newText.slice(currentPosition),
        format: {
          bold: false,
          italic: false,
          color: "black",
          fontSize: "normal",
        },
      })
    }

    // If no segments were created, create one with the entire text
    if (segments.length === 0) {
      segments.push({
        text: newText,
        format: content[0]?.format || {
          bold: false,
          italic: false,
          color: "black",
          fontSize: "normal",
        },
      })
    }

    setContent(segments)
    skipNextUpdate.current = true
    onChange({ target: { value: JSON.stringify(segments) } })
  }

  const handleSelectionChange = e => {
    const target = e.target
    const start = target.selectionStart
    const end = target.selectionEnd

    if (start === end) {
      setSelection(null)
      return
    }

    // Find segments that contain the selection
    let currentPosition = 0
    let selectionSegments = []

    content.forEach((segment, index) => {
      const segmentStart = currentPosition
      const segmentEnd = segmentStart + segment.text.length

      if (!(end <= segmentStart || start >= segmentEnd)) {
        selectionSegments.push({
          index,
          segment,
          start: Math.max(0, start - segmentStart),
          end: Math.min(segment.text.length, end - segmentStart),
        })
      }

      currentPosition += segment.text.length
    })

    setSelection({
      start,
      end,
      text: target.value.substring(start, end),
      segments: selectionSegments,
    })
  }

  const applyFormat = (formatType, formatValue) => {
    if (!selection) return

    const newContent = []
    let currentPosition = 0

    content.forEach(segment => {
      const segmentStart = currentPosition
      const segmentEnd = currentPosition + segment.text.length

      // If segment is outside selection, keep it as is
      if (segmentEnd <= selection.start || segmentStart >= selection.end) {
        newContent.push(segment)
      } else {
        // Split segment if needed
        if (segmentStart < selection.start) {
          // Add prefix (before selection)
          newContent.push({
            text: segment.text.slice(0, selection.start - segmentStart),
            format: { ...segment.format },
          })
        }

        // Add selected part with new format
        newContent.push({
          text: segment.text.slice(
            Math.max(0, selection.start - segmentStart),
            Math.min(segment.text.length, selection.end - segmentStart)
          ),
          format: {
            ...segment.format,
            [formatType]: formatValue,
          },
        })

        if (segmentEnd > selection.end) {
          // Add suffix (after selection)
          newContent.push({
            text: segment.text.slice(selection.end - segmentStart),
            format: { ...segment.format },
          })
        }
      }

      currentPosition += segment.text.length
    })

    setContent(newContent)
    skipNextUpdate.current = true
    onChange({ target: { value: JSON.stringify(newContent) } })
  }

  // Combine segments for display
  const displayText = content.map(segment => segment.text).join("")

  return (
    <div className="w-full">
      <Toolbar.Root className="flex w-full min-w-max rounded-t-lg bg-gray-50 p-2 border border-gray-300">
        <Toolbar.ToggleGroup
          type="multiple"
          aria-label="Text formatting"
          className="flex gap-1"
        >
          <Toolbar.ToggleItem
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#105D8D] data-[state=on]:bg-[#105D8D] data-[state=on]:text-white"
            value="bold"
            aria-label="Bold"
            onClick={() => applyFormat("bold", !content[0]?.format.bold)}
          >
            <FontBoldIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="inline-flex h-8 w-8 items-center justify-center rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#105D8D] data-[state=on]:bg-[#105D8D] data-[state=on]:text-white"
            value="italic"
            aria-label="Italic"
            onClick={() => applyFormat("italic", !content[0]?.format.italic)}
          >
            <FontItalicIcon />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300" />

        <select
          className="h-8 rounded border border-gray-300 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#105D8D]"
          value={content[0]?.format.color || "black"}
          onChange={e => applyFormat("color", e.target.value)}
          disabled={disabled}
        >
          <option value="black">შავი</option>
          <option value="#105D8D">ლურჯი</option>
          <option value="#22C55E">მწვანე</option>
          <option value="#EF4444">წითელი</option>
        </select>

        <Toolbar.Separator className="mx-2 w-px bg-gray-300" />

        <select
          className="h-8 rounded border border-gray-300 bg-white px-2 focus:outline-none focus:ring-2 focus:ring-[#105D8D]"
          value={content[0]?.format.fontSize || "normal"}
          onChange={e => applyFormat("fontSize", e.target.value)}
          disabled={disabled}
        >
          <option value="normal">ნორმალური</option>
          <option value="large">დიდი</option>
        </select>
      </Toolbar.Root>

      <div className="relative">
        <textarea
          value={displayText}
          onChange={handleTextChange}
          onSelect={handleSelectionChange}
          className="w-full min-h-[100px] px-4 py-3 rounded-b-lg border border-t-0 border-gray-300 focus:border-[#105D8D] focus:ring-1 focus:ring-[#105D8D] focus:outline-none transition-colors resize-none"
          placeholder={placeholder}
          disabled={disabled}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none px-4 py-3"
        >
          {content.map((segment, index) => (
            <span
              key={index}
              style={{
                fontWeight: segment.format.bold ? "bold" : "normal",
                fontStyle: segment.format.italic ? "italic" : "normal",
                color: segment.format.color || "black",
                fontSize: segment.format.fontSize === "large" ? "1.2em" : "1em",
              }}
            >
              {segment.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default React.memo(RichTextEditor)
