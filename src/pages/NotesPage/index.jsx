import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Container, Row, Col, Button, Input } from "reactstrap"
import { debounce } from "lodash"
import { getNoteList, deleteNote } from "../../services/note"
import Breadcrumbs from "components/Common/Breadcrumb"
import NoteCard from "../../components/NoteCard"
import DeleteModal from "../../components/DeleteModal"
import { Box, CircularProgress, Typography } from "@mui/material"

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
        setError("ჩანაწერების ჩატვირთვა ვერ მოხერხდა")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const debouncedSetSearchQuery = useMemo(
    () =>
      debounce(value => {
        setSearchQuery(value)
      }, 300),
    []
  )

  const handleGetStarted = () => {
    navigate("/tools/notes/create")
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
    navigate(`/tools/notes/edit/${noteId}`)
  }

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes
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

  const handleSearchChange = e => {
    debouncedSetSearchQuery(e.target.value)
  }

  if (isLoading) {
    return (
      <Container fluid className="page-content">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container fluid className="page-content">
        <Box display="flex" flexDirection="column" alignItems="center" pt={5}>
          <Typography color="error" variant="h6" gutterBottom>
            {error}
          </Typography>
          <Button color="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container fluid className="page-content">
      <Breadcrumbs title="ადმინი" breadcrumbItem="ჩემი ჩანაწერები" />

      <Row className="mb-4">
        <Col md={{ size: 6, offset: 6 }} className="text-right">
          <Box display="flex" justifyContent="flex-end" width="100%">
            <Input
              type="text"
              placeholder="ძებნა..."
              onChange={handleSearchChange}
              style={{ maxWidth: "250px", marginRight: "10px" }}
            />
            <Link to="/tools/notes/create">
              <Button color="primary" className="d-flex align-items-center">
                დამატება
              </Button>
            </Link>
          </Box>
        </Col>
      </Row>

      <Row>
        {filteredNotes.length === 0 ? (
          <Col className="text-center pt-5">
            <Typography variant="h6" className="font-weight-bold mb-3">
              ჩანაწერები ვერ მოიძებნა
            </Typography>
            <Typography>
              თქვენ ჯერ არ გაქვთ ჩანაწერები, დაამატეთ პირველი ჩანაწერი
            </Typography>
            <Button
              color="primary"
              onClick={handleGetStarted}
              style={{ marginTop: "20px" }}
            >
              დაწყება
            </Button>
          </Col>
        ) : (
          filteredNotes.map(note => (
            <Col md="4" key={note.id}>
              <NoteCard
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
