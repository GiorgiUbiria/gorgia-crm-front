import React from "react"
import { Mention, MentionsInput as ReactMentions } from "react-mentions"

const MentionsInput = ({ value, onChange, placeholder, mentions, className }) => {
  const mentionStyle = {
    control: {
      backgroundColor: "#fff",
      fontSize: 14,
      fontWeight: "normal",
    },
    input: {
      margin: 0,
      padding: "8px 12px",
      border: "1px solid #ced4da",
      borderRadius: "0.25rem",
      width: "100%",
      height: "100%",
      minHeight: "80px",
    },
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid rgba(0,0,0,0.15)",
        borderRadius: "0.25rem",
        fontSize: 14,
        maxHeight: "200px",
        overflow: "auto",
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

  return (
    <div className={className}>
      <ReactMentions
        value={value}
        onChange={onChange}
        style={mentionStyle}
        placeholder={placeholder}
        a11ySuggestionsListLabel={"Suggested departments for mention"}
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