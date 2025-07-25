import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { ArrowBack, Edit, Delete, Person, Schedule, Warning } from '@mui/icons-material'
import { useNoteStore } from '../stores/noteStore'
import { useAuthStore } from '../stores/authStore'
import { NoteContent } from '../components/NoteContent'
import { formatDate, getRelativeTime } from '../utils/dateFormat'
import { Note } from '../types/Note'

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    currentNote,
    loading,
    error,
    fetchNoteById,
    deleteNote,
    clearError,
  } = useNoteStore()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (id) {
      fetchNoteById(id)
    }
    return () => clearError()
  }, [id, fetchNoteById, clearError])

  const getAuthorDisplayName = (note: Note) => {
    if (note.author?.firstName && note.author?.lastName) {
      return `${note.author.firstName} ${note.author.lastName}`
    }
    return note.author?.username || 'Anonymous'
  }

  const isAuthor = user && currentNote && user.id === currentNote.authorId

  const handleDelete = async () => {
    if (!currentNote?.id) return
    
    setIsDeleting(true)
    try {
      await deleteNote(currentNote.id)
      navigate('/notes')
    } catch (error) {
      console.error('Failed to delete note:', error)
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  if (loading && !currentNote) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (error && !currentNote) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/notes')}
          >
            Back to Notes
          </Button>
        </Container>
      </Box>
    )
  }

  if (!currentNote) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="warning" sx={{ mb: 3 }}>
            Note not found.
          </Alert>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/notes')}
          >
            Back to Notes
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="md">
        {/* Back Button */}
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/notes')}
          sx={{ mb: 3 }}
        >
          Back to Notes
        </Button>

        <Paper elevation={1} sx={{ p: 4, mb: 4 }}>
          {/* Note Title */}
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            {currentNote.title}
          </Typography>

          {/* Author Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              src={currentNote.author?.avatar}
              sx={{ width: 48, height: 48, mr: 2 }}
            >
              {currentNote.author?.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h6" component="span">
                  {getAuthorDisplayName(currentNote)}
                </Typography>
                <Chip
                  icon={<Schedule />}
                  label={getRelativeTime(currentNote.createdAt)}
                  size="small"
                  variant="outlined"
                  title={formatDate(currentNote.createdAt)}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                @{currentNote.author?.username || 'unknown'}
                • Published on {formatDate(currentNote.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Synopsis */}
          {currentNote.synopsis && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Synopsis
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {currentNote.synopsis}
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          {/* Full Note Content */}
          <Box sx={{ mb: 4 }}>
            {currentNote.content ? (
              <NoteContent content={currentNote.content} />
            ) : (
              <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No content available for this note.
              </Typography>
            )}
          </Box>

          {isAuthor && (
            <Box sx={{ display: 'flex', gap: 2, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                component={Link}
                to={`/notes/${currentNote.id}/edit`}
              >
                Edit Note
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Note'}
              </Button>
            </Box>
          )}
        </Paper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="error" />
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete "<strong>{currentNote.title}</strong>"? 
              This action cannot be undone and the note will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              color="error"
              variant="contained"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
            >
              {isDeleting ? 'Deleting...' : 'Delete Note'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}

export default NoteDetailPage

