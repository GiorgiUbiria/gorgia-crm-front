import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Box, IconButton, Typography } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import "react-quill/dist/quill.snow.css"
import { createNote } from "../../services/note"
import NoteForm from "./NoteForm"

const CreateNote = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async data => {
    setIsSubmitting(true)
    setError("")
    try {
      await createNote({
        title: data.title.trim(),
        content: data.content.trim(),
      })
      navigate("/tools/notes")
    } catch (err) {
      const serverErrors = err.response?.data
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors)
          .flat()
          .filter(Boolean)
          .join(", ")
        setError(errorMessages || "ახალი ჩანაწერის შექმნა ვერ მოხერხდა")
      } else {
        setError("ახალი ჩანაწერის შექმნა ვერ მოხერხდა")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="notes-editor-container">
          <Box
            sx={{
              width: "100%",
              padding: "30px",
              backgroundColor: "#ffffff",
              borderRadius: "15px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <IconButton
                onClick={() => navigate("/tools/notes")}
                sx={{ color: "#007dba" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5">ახალი ჩანაწერის შექმნა</Typography>
            </Box>

            <NoteForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              initialValues={{ title: "", content: "" }}
            />
          </Box>
        </div>
      </div>
    </div>
  )
}

export default CreateNote
