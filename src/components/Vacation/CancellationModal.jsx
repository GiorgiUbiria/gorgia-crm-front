import React, { useState } from "react"
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap"
import { toast } from "react-toastify"
import { cancelVacation } from "../../services/admin/vacation"

const CancellationModal = ({ isOpen, toggle, vacationId, onSuccess }) => {
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (reason.length < 5) {
      toast.error("მიზეზი უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს")
      return
    }

    setIsSubmitting(true)
    try {
      await cancelVacation(vacationId, { cancellation_reason: reason })
      toast.success("შვებულება წარმატებით გაუქმდა")
      onSuccess()
      toggle()
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "შვებულების გაუქმებისას დაფიქსირდა შეცდომა"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        შვებულების გაუქმება
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="cancellationReason">გაუქმების მიზეზი</Label>
            <Input
              type="textarea"
              name="cancellationReason"
              id="cancellationReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="მიუთითეთ გაუქმების მიზეზი (მინიმუმ 5 სიმბოლო)"
              rows="4"
              required
              minLength={5}
            />
          </FormGroup>
          <div className="d-flex justify-content-end gap-2">
            <Button
              type="button"
              color="secondary"
              onClick={toggle}
              disabled={isSubmitting}
            >
              გაუქმება
            </Button>
            <Button
              type="submit"
              color="danger"
              disabled={isSubmitting || reason.length < 5}
            >
              {isSubmitting ? "მიმდინარეობს..." : "დადასტურება"}
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default CancellationModal 