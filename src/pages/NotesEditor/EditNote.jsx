import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { getNote, updateNote } from "../../services/note"
import NoteForm from "./NoteForm"

const EditNote = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [note, setNote] = useState(null)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote(id)
        setNote(response.data)
      } catch (err) {
        setError("Failed to load note data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [id])

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setError("")
    try {
      await updateNote(id, {
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
        setError(errorMessages || "ჩანაწერის განახლება ვერ მოხერხდა")
      } else {
        setError("ჩანაწერის განახლება ვერ მოხერხდა")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!note && !isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">ჩანაწერი ვერ მოიძებნა</Typography>
      </Box>
    )
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
              <Typography variant="h5">ჩანაწერის განახლება</Typography>
            </Box>

            <NoteForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
              initialValues={{
                title: note?.title || "",
                content: note?.content || "",
              }}
            />
          </Box>
        </div>
      </div>
    </div>
  )
}

export default EditNote 