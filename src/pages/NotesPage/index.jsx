import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { debounce } from "lodash"
import { getNoteList, deleteNote } from "../../services/note"
import NoteCard from "../../components/NoteCard"
import DeleteModal from "../../components/DeleteModal"
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"

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
      <div className="min-h-screen bg-white dark:!bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:!border-blue-400"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:!bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center pt-5">
            <p className="text-red-600 dark:!text-red-400 text-xl mb-4">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 hover:bg-blue-700 dark:!bg-blue-600 dark:!hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:!bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:!text-white">
            ჩანაწერები
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="ძებნა..."
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:!border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:!bg-gray-800 dark:!text-white"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:!text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Link
              to="/tools/notes/create"
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 dark:!bg-blue-600 dark:!hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center justify-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              დამატება
            </Link>
          </div>
        </div>
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:!text-white mb-3">
              ჩანაწერები ვერ მოიძებნა
            </h2>
            <p className="text-gray-600 dark:!text-gray-400 mb-6">
              თქვენ ჯერ არ გაქვთ ჩანაწერები, დაამატეთ პირველი ჩანაწერი
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-blue-500 hover:bg-blue-700 dark:!bg-blue-600 dark:!hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
            >
              დაწყება
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={note => {
                  setNoteToDelete(note)
                  setDeleteModalOpen(true)
                }}
                onEdit={handleEditNote}
              />
            ))}
          </div>
        )}
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleDeleteNote}
        />
      </div>
    </div>
  )
}

export default NotesPage
