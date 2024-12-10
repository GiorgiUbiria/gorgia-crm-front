import React from "react"
import { Mention, MentionsInput as ReactMentions } from "react-mentions"

const defaultStyle = {
  control: {
    minHeight: "100px",
    backgroundColor: "#fff",
    fontSize: 14,
    fontWeight: "normal",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
  },
  highlighter: {
    padding: "12px",
    minHeight: "100px",
    border: "1px solid transparent",
  },
  input: {
    padding: "12px",
    minHeight: "100px",
    outline: 0,
    border: 0,
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      borderRadius: "0.25rem",
      fontSize: 14,
      maxHeight: "200px",
      overflow: "auto",
      position: "absolute",
      bottom: "100%",
      marginBottom: "8px",
    },
    item: {
      padding: "8px 12px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#f8f9fa",
      },
    },
  },
}

const MentionsInput = ({
  value,
  onChange,
  placeholder,
  mentions,
  className,
  style = {},
}) => {
  return (
    <div className={className} style={{ position: "relative" }}>
      <ReactMentions
        value={value}
        onChange={onChange}
        style={{ ...defaultStyle, ...style }}
        placeholder={placeholder}
        a11ySuggestionsListLabel={"Suggested departments for mention"}
        singleLine={false}
        forceSuggestionsAboveCursor={true}
      >
        <Mention
          trigger="@"
          data={mentions}
          renderSuggestion={(suggestion, search, highlightedDisplay) => (
            <div className="d-flex align-items-center">
              <i className="bx bx-building-house me-2"></i>
              {highlightedDisplay}
            </div>
          )}
          displayTransform={(id, display) => `@${display}`}
        />
      </ReactMentions>
    </div>
  )
}

export default MentionsInput
