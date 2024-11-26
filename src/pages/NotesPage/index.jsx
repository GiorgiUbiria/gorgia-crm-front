import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { getNoteList, deleteNote } from "../../services/note"
import Breadcrumbs from "components/Common/Breadcrumb"

const NoteCard = ({ note, onDelete, onEdit }) => (
  console.log(note),
  (
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
          <p className="text-muted small">
            {new Date(note.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
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
        <h6 className="font-weight-bold text-primary">{note.title}</h6>
        <p
          className="text-muted note-content"
          dangerouslySetInnerHTML={{ __html: note.note }}
        />
      </CardBody>
    </Card>
  )
)

const MemoizedNoteCard = React.memo(NoteCard)
MemoizedNoteCard.displayName = "NoteCard"

const DeleteModal = ({ isOpen, toggle, onDelete }) => (
  <Modal isOpen={isOpen} toggle={toggle}>
    <ModalHeader toggle={toggle}>ჩანაწერის წაშლა</ModalHeader>
    <ModalBody>
      დარწმუნებული ხართ, რომ გსურთ ამ ჩანაწერის წაშლა? ეს მოქმედება ვერ
      დაბრუნდება.
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={toggle}>
        გაუქმება
      </Button>
      <Button color="danger" onClick={onDelete}>
        წაშლა
      </Button>
    </ModalFooter>
  </Modal>
)

const NotesPage = () => {
  const [notes, setNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getNoteList()
        const sortedNotes = response.data.notes.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
        setNotes(sortedNotes)
      } catch (error) {
        setError("Failed to load notes. Please try again later.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleGetStarted = () => {
    navigate("/notes-editor")
  }

  const handleDeleteNote = useCallback(async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete.id)
        setNotes(prevNotes =>
          prevNotes.filter(note => note.id !== noteToDelete.id)
        )
        setDeleteModalOpen(false)
        setNoteToDelete(null)
      } catch (error) {
        console.error("Error deleting note:", error)
      }
    }
  }, [noteToDelete])

  const handleEditNote = noteId => {
    navigate(`/notes-editor/${noteId}`)
  }

  const filteredNotes = useMemo(() => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase()
    return notes.filter(note => {
      const lowerCaseTitle = (note.title || "").toLowerCase()
      const lowerCaseNote = (note.note || "")
        .replace(/(<([^>]+)>)/gi, "")
        .toLowerCase()
      return (
        lowerCaseTitle.includes(lowerCaseSearchQuery) ||
        lowerCaseNote.includes(lowerCaseSearchQuery)
      )
    })
  }, [notes, searchQuery])

  if (isLoading) {
    return (
      <Container fluid className="page-content">
        <div className="text-center pt-5">
          <p>Loading notes...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container fluid className="page-content">
        <div className="text-center pt-5">
          <p className="text-danger">{error}</p>
          <Button color="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="page-content">
      <Breadcrumbs title="ადმინი" breadcrumbItem="ჩემი ჩანაწერები" />

      <Row className="mb-4">
        <Col md={{ size: 6, offset: 6 }} className="text-right">
          <div className="d-flex justify-content-end">
            <Input
              type="text"
              placeholder="ძებნა..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ maxWidth: "250px", marginRight: "10px" }}
            />
            <Link to="/notes-editor">
              <Button color="primary" className="d-flex align-items-center">
                დამატება
              </Button>
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        {filteredNotes.length === 0 ? (
          <Col className="text-center pt-5">
            <h6 className="font-weight-bold mb-3">No Notes Found</h6>
            <p>You don't have any notes yet. Click below to get started.</p>
            <Button color="primary" onClick={handleGetStarted}>
              Get Started
            </Button>
          </Col>
        ) : (
          filteredNotes.map(note => (
            <Col md="4" key={note.id}>
              <MemoizedNoteCard
                note={note}
                onDelete={note => {
                  setNoteToDelete(note)
                  setDeleteModalOpen(true)
                }}
                onEdit={handleEditNote}
              />
            </Col>
          ))
        )}
      </Row>

      <DeleteModal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(!deleteModalOpen)}
        onDelete={handleDeleteNote}
      />
    </Container>
  )
}

export default NotesPage
