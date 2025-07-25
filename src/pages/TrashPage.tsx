/**
 * NOTELY FRONTEND - TRASH PAGE COMPONENT
 * 
 * This component displays all deleted notes and provides functionality to restore
 * or permanently delete them. It follows the same design patterns as NotesPage
 * but focuses on deleted note management.
 * 
 * Key Features:
 * - Display all deleted notes in a grid layout
 * - Search functionality for deleted notes
 * - Restore notes back to active state
 * - Permanent deletion option
 * - Responsive design with Material-UI components
 * 
 * Architecture Pattern: This follows the Container/Presentational pattern where
 * this component acts as a container managing state and business logic.
 */

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
  Button,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip
} from '@mui/material'
import { Search, Restore, DeleteForever, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useNoteStore } from '../stores/noteStore'
import { Note } from '../types/Note'
import { formatDate } from '../utils/dateFormat'

/**
 * TrashPage Component
 * 
 * Manages the display and interaction with deleted notes. Provides users
 * with the ability to review, restore, or permanently delete their notes.
 * 
 * State Management:
 * - Uses noteStore for deleted notes data and operations
 * - Local state for search filtering and UI interactions
 * - Navigation state for returning to main notes page
 */
const TrashPage = () => {
  // Store hooks for deleted notes management
  const { deletedNotes, fetchDeletedNotes, restoreNote, loading, error, clearError } = useNoteStore()
  const navigate = useNavigate()
  
  // Local state for search functionality
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])

  /**
   * Effect: Fetch Deleted Notes on Component Mount
   * 
   * Loads all deleted notes when the component mounts and cleans up
   * any existing errors from the store.
   */
  useEffect(() => {
    fetchDeletedNotes()
    return () => clearError()
  }, [fetchDeletedNotes, clearError])

  /**
   * Effect: Filter Notes Based on Search Term
   * 
   * Filters the deleted notes based on the search term, searching across
   * title, content, synopsis, and author information.
   */
  useEffect(() => {
    if (searchTerm) {
      const filtered = deletedNotes.filter(note =>
        note.author?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.author?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.synopsis?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredNotes(filtered)
    } else {
      setFilteredNotes(deletedNotes)
    }
  }, [searchTerm, deletedNotes])

  /**
   * Handle Note Restoration
   * 
   * Restores a deleted note back to the active notes list.
   * Shows success feedback and refreshes the deleted notes list.
   * 
   * @param noteId - ID of the note to restore
   */
  const handleRestoreNote = async (noteId: string) => {
    try {
      await restoreNote(noteId)
      // Note will be automatically removed from deletedNotes by the store
    } catch (error) {
      console.error('Failed to restore note:', error)
    }
  }

  /**
   * Handle Permanent Deletion
   * 
   * Permanently deletes a note from the system. This action cannot be undone.
   * Shows confirmation dialog before proceeding.
   * 
   * @param noteId - ID of the note to permanently delete
   */
  const handlePermanentDelete = async (noteId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      try {
        // TODO: Implement permanent delete API endpoint
        console.log('Permanently delete note:', noteId)
      } catch (error) {
        console.error('Failed to permanently delete note:', error)
      }
    }
  }

  // Loading state display
  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Box>
    )
  }

  // Error state display
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
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/notes')} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Trash
            </Typography>
          </Box>
          {deletedNotes.length > 0 && (
            <Typography variant="body2" color="text.secondary">
              {filteredNotes.length} of {deletedNotes.length} deleted notes
            </Typography>
          )}
        </Box>

        {/* Search Field */}
        <TextField
          fullWidth
          placeholder="Search deleted notes by author, title, synopsis, or content..."
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

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              <Grid item xs={12} sm={6} lg={4} key={note.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s ease-in-out'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Note Title */}
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                      {note.title}
                    </Typography>
                    
                    {/* Note Synopsis */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {note.synopsis}
                    </Typography>
                    
                    {/* Note Content Preview */}
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {note.content.length > 100 
                        ? `${note.content.substring(0, 100)}...` 
                        : note.content
                      }
                    </Typography>
                    
                    {/* Author and Date Information */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={`${note.author?.firstName} ${note.author?.lastName}`}
                        size="small"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        Deleted: {formatDate(note.updatedAt)}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  {/* Action Buttons */}
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Button
                      startIcon={<Restore />}
                      onClick={() => handleRestoreNote(note.id)}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >
                      Restore
                    </Button>
                    <Button
                      startIcon={<DeleteForever />}
                      onClick={() => handlePermanentDelete(note.id)}
                      variant="outlined"
                      color="error"
                      size="small"
                    >
                      Delete Forever
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty State */
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No deleted notes found matching your search.' : 'No deleted notes found.'}
            </Typography>
            {!searchTerm && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Deleted notes will appear here and can be restored or permanently deleted.
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => navigate('/notes')}
              startIcon={<ArrowBack />}
            >
              Back to Notes
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}

export default TrashPage

