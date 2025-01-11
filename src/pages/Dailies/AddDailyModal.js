import React, { useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useCreateDepartmentHeadDaily } from "../../queries/daily"

const AddDailyModal = ({ isOpen, toggle, onDailyAdded, departmentId }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    description: "",
    department_id: departmentId,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate: createDaily, isLoading: createLoading } =
    useCreateDepartmentHeadDaily()

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await createDaily(formData)
      onDailyAdded()
      toggle()
      setFormData({
        date: new Date().toISOString().split("T")[0],
        name: "",
        description: "",
        department_id: departmentId,
      })
    } catch (error) {
      console.error("Error creating daily:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={toggle} maxWidth="sm" fullWidth>
      <DialogTitle>დღის საკითხის დამატება</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="თარიღი"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
            margin="normal"
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            label="საკითხი"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            margin="normal"
            disabled={isSubmitting}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="აღწერა"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            disabled={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle}>გაუქმება</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || createLoading}
          >
            დამატება
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddDailyModal
