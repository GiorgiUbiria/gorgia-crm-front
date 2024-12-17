import React, { memo } from "react"
import { Card, CardBody, Button } from "reactstrap"
import { Typography } from "@mui/material"

const NoteCard = ({ note, onDelete, onEdit }) => (
  <Card
    className="mb-4 note-card"
    style={{
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
    }}
    onClick={() => onEdit(note.id)}
  >
    <CardBody>
      <div className="d-flex justify-content-between">
        <Typography variant="body2" color="textSecondary">
          {new Date(note.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Typography>
        <Button
          color="danger"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            onDelete(note)
          }}
        >
          წაშლა
        </Button>
      </div>
      <Typography variant="h6" className="font-weight-bold text-primary">
        {note.title}
      </Typography>
      <Typography
        className="text-muted note-content"
        dangerouslySetInnerHTML={{ __html: note.note }}
      />
    </CardBody>
  </Card>
)

export default memo(NoteCard) 