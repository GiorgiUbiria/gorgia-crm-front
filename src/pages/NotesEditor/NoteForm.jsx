import React from "react"
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material"
import SaveIcon from "@mui/icons-material/Save"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { useForm, Controller } from "react-hook-form"

const NoteForm = ({ onSubmit, isSubmitting, error, initialValues }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: initialValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        render={({ field }) => (
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
        )}
      />

      {errors.content && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {errors.content.message}
        </Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isDirty}
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
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <SaveIcon />
          )}
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Box>

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
    </form>
  )
}

export default NoteForm 