import React, { useEffect, useState, useCallback, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  Box,
  TextField,
  IconButton,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import SaveIcon from "@mui/icons-material/Save"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useForm, Controller } from "react-hook-form"
import { createNote, updateNote, getNote } from "../../services/note"

const NotesEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loadingState, setLoadingState] = useState({
    isFetching: false,
    isSaving: false,
  })
  const [error, setError] = useState("")

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  })

  const isNew = useMemo(() => id === "new", [id])

  const fetchNote = useCallback(
    async noteId => {
      if (isNew) return
      setLoadingState(prev => ({ ...prev, isFetching: true }))
      try {
        const response = await getNote(noteId)
        const { title, content } = response.data
        reset({
          title: title || "",
          content: content || "",
        })
      } catch (err) {
        setError("Failed to load note data.")
      } finally {
        setLoadingState(prev => ({ ...prev, isFetching: false }))
      }
    },
    [reset, isNew]
  )

  useEffect(() => {
    fetchNote(id)
  }, [id, fetchNote])

  const onSubmit = async data => {
    setLoadingState(prev => ({ ...prev, isSaving: true }))
    setError("")
    try {
      const payload = {
        title: data.title.trim(),
        content: data.content.trim(),
      }
      
      if (isNew) {
        await createNote(payload)
      } else {
        await updateNote(id, payload)
      }
      navigate("/tools/notes")
    } catch (err) {
      const serverErrors = err.response?.data
      if (serverErrors) {
        const errorMessages = Object.values(serverErrors)
          .flat()
          .filter(Boolean)
          .join(", ")
        setError(errorMessages || "Failed to save note")
      } else {
        setError("Failed to save note. Please try again.")
      }
    } finally {
      setLoadingState(prev => ({ ...prev, isSaving: false }))
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
              {/* Back Button */}
              <IconButton
                onClick={() => navigate("/tools/notes")}
                sx={{ color: "#007dba" }}
              >
                <ArrowBackIcon />
              </IconButton>

              {/* Save Button with Loading Indicator */}
              <Button
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={loadingState.isSaving || !isDirty}
                sx={{
                  backgroundColor: "#007dba",
                  color: "#ffffff",
                  borderRadius: "25px",
                  padding: "10px 20px",
                  fontWeight: "bold",
                  textTransform: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {loadingState.isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SaveIcon />
                )}
                {loadingState.isSaving ? "Saving..." : "Save"}
              </Button>
            </Box>

            {/* Title Input */}
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Title is required",
                maxLength: {
                  value: 255,
                  message: "Title must not exceed 255 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="standard"
                  placeholder="Note Title..."
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ""}
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#007dba",
                    },
                  }}
                  sx={{ mb: 3 }}
                />
              )}
            />

            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) =>
                loadingState.isFetching ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <ReactQuill
                    {...field}
                    onChange={value => field.onChange(value)}
                    placeholder="Type your note here..."
                    theme="snow"
                    style={{
                      height: "300px",
                      marginBottom: "50px",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "10px",
                      padding: "10px",
                    }}
                  />
                )
              }
            />
            {errors.content && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.content.message}
              </Typography>
            )}

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  marginTop: "20px",
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#ffefef",
                }}
              >
                <Typography sx={{ color: "#d9534f" }}>{error}</Typography>
              </Box>
            )}
          </Box>
        </div>
      </div>
    </div>
  )
}

export default NotesEditor
