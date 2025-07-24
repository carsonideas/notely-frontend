

import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Grid,
  Alert,
  CircularProgress,
  Fab,
} from '@mui/material'
import { Search, Add } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { useNoteStore } from '../stores/noteStore'
import { useAuthStore } from '../stores/authStore'
import { NoteCard } from '../components/NoteCard'
import { Note } from '../types/Note'

const NotesPage = () => {
  const { notes, fetchNotes, loading, error, clearError } = useNoteStore()
  const { isAuthenticated } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  useEffect(() => {
    fetchNotes()
    return () => clearError()
  }, [fetchNotes, clearError])

  useEffect(() => {
    if (searchTerm) {
      const filtered = notes.filter(note =>
        note.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.synopsis?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredNotes(filtered)
    } else {
      setFilteredNotes(notes)
    }
  }, [searchTerm, notes])

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4, minHeight: '100vh', bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            My Notes
          </Typography>
          {notes.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {filteredNotes.length} of {notes.length} notes
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          placeholder="Search by author, title, synopsis, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            mb: 4,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {filteredNotes.length > 0 ? (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} lg={4} key={note.id}>
                <NoteCard note={note} showActions={true} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No notes found matching your search.' : 'No notes available yet.'}
            </Typography>
            {!searchTerm && isAuthenticated && (
              <Typography variant="body2" color="text.secondary">
                Create your first note to get started!
              </Typography>
            )}
          </Box>
        )}

        {/* Floating Action Button for creating new note */}
        {isAuthenticated && (
          <Fab
            color="primary"
            aria-label="create note"
            component={Link}
            to="/notes/create"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Add />
          </Fab>
        )}
      </Container>
    </Box>
  )
}

export default NotesPage