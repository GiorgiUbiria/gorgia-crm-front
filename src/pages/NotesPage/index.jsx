import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { getNoteList, deleteNote } from "../../services/note";
import SaveIcon from "../../assets/images/save.png";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNoteList();
        const sortedNotes = response.data.notes.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotes(sortedNotes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleGetStarted = () => {
    navigate("/notes-editor");
  };

  const handleDeleteNote = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete.id);
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== noteToDelete.id)
        );
        setDeleteModalOpen(false);
        setNoteToDelete(null);
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleEditNote = (noteId) => {
    navigate(`/notes-editor/${noteId}`);
  };

  const filteredNotes = notes.filter((note) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const lowerCaseTitle = note.title ? note.title.toLowerCase() : "";
    const lowerCaseNote = note.note
      ? note.note.replace(/(<([^>]+)>)/gi, "").toLowerCase()
      : "";
    return (
      lowerCaseTitle.includes(lowerCaseSearchQuery) ||
      lowerCaseNote.includes(lowerCaseSearchQuery)
    );
  });

  return (
    <Container fluid className="page-content">
      <Breadcrumb>
        <BreadcrumbItem active>Admin</BreadcrumbItem>
        <BreadcrumbItem active>My Notes</BreadcrumbItem>
      </Breadcrumb>

      <Row className="mb-4">
        <Col md="6">
          <h4 className="font-weight-bold text-primary">Notes</h4>
        </Col>
        <Col md="6" className="text-right">
          <div className="d-flex justify-content-end">
            <Input
              type="text"
              placeholder="ძებნა..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: "250px", marginRight: "10px" }}
            />
            <Link to="/notes-editor">
              <Button color="primary" className="d-flex align-items-center">
                {/* <img src={SaveIcon} alt="Save Icon" style={{ width: "16px" }} /> */}
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
          filteredNotes.map((note) => (
            <Col md="4" key={note.id}>
              <Card
                className="mb-4"
                style={{
                  boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                }}
                onClick={() => handleEditNote(note.id)} // Navigate to the note editor when clicked
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
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the note click from triggering when clicking delete
                        setNoteToDelete(note);
                        setDeleteModalOpen(true);
                      }}
                    >
                      წაშლა
                    </Button>
                  </div>
                  <h6 className="font-weight-bold text-primary">{note.title}</h6>
                  <p
                    className="text-muted"
                    dangerouslySetInnerHTML={{ __html: note.note }}
                  />
                </CardBody>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal
        isOpen={deleteModalOpen}
        toggle={() => setDeleteModalOpen(!deleteModalOpen)}
      >
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>
          Delete Note
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete this note? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="danger" onClick={handleDeleteNote}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default NotesPage;
