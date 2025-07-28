

/**
 * NOTELY FRONTEND - NOTES PAGE COMPONENT (NOTEPAD LAYOUT)
 * 
 * This component implements the desired notepad layout with a grid-based time slot system.
 * It provides an intuitive interface for creating, viewing, and managing notes in a 
 * calendar-like format with pop-up modals for all interactions.
 * 
 * Key Features:
 * - Grid-based time slot layout (9AM, 10AM, 11AM, 1PM, 2PM)
 * - Author profile tabs for filtering notes
 * - Pop-up modals for creating, editing, and viewing notes
 * - Side panel for note details and comments
 * - Drag-and-drop style note cards
 * - Real-time note management with backend synchronization
 * 
 * Architecture Pattern: This follows the Container/Presentational pattern with
 * integrated state management for complex note interactions.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Add as PlusIcon,
  Close as XIcon,
  AccessTime as ClockIcon,
  Delete as Trash2Icon,
  Comment as MessageCircleIcon,
  CloudUpload,
  Delete
} from '@mui/icons-material';
import { useNoteStore } from '../stores/noteStore';
import { useAuthStore } from '../stores/authStore';
import { Note, CreateNoteRequest } from '../types/Note';
import { formatDate } from '../utils/dateFormat';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { NotesListModal } from '../components/NotesListModal';

interface TimeSlotProps {
  time: string;
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onTimeSlotClick: (timeSlot: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, notes, onNoteClick, onTimeSlotClick }) => {
  if (!notes || notes.length === 0) {
    return (
      <Box sx={{ height: 120 }}>
        <Paper
          elevation={0}
          sx={{
            // mt:30,
            height: '100%',
            border: '2px dashed #e0e0e0',
            borderRadius: 3,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: '#bdbdbd',
              bgcolor: '#fafafa',
              transform: 'translateY(-1px)'
            }
          }}
          onClick={() => onTimeSlotClick(time)}
        >
          <Box
            sx={{
              
              width: 32,
              height: 32,
              bgcolor: '#f5f5f5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
            <PlusIcon sx={{ fontSize: 16, color: '#757575' }} />
          </Box>
          <Typography variant="caption" sx={{ color: '#757575', fontWeight: 500 }}>
            Add Note
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 120 }}>
      {notes.map((note) => (
        <Card
          key={note.id}
          sx={{
            
            height: '100%',
            cursor: 'pointer',
            bgcolor: '#f5f1eb', // Light orange/beige background for assigned boxes
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: 2,
              transform: 'translateY(-1px)',
              bgcolor: '#f0ebe3' // Slightly darker on hover
            }
          }}
          onClick={() => onNoteClick(note)}
        >
          <CardContent sx={{ p: 2, display: 'flex', gap: 1.5, height: '100%' }}>
            <Avatar
              src={note.author?.avatar || `https://ui-avatars.com/api/?name=${note.author?.firstName}+${note.author?.lastName}&background=random`}
              sx={{ width: 32, height: 32, flexShrink: 0 }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }} noWrap>
                {note.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap>
                {note.author?.firstName} {note.author?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" noWrap sx={{ mt: 0.5 }}>
                {note.synopsis}
              </Typography>
              {/* Comments indicator would go here if implemented */}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

/**
 * Main NotesPage Component
 * 
 * Orchestrates the entire notepad interface including the grid layout,
 * modals, and side panel interactions.
 */
const NotesPage = () => {
  // Store hooks
  const { notes, fetchNotes, createNote, updateNote, deleteNote, loading, error, clearError } = useNoteStore();
  const { user, isAuthenticated } = useAuthStore();

  // UI State
  const [showNoteDetails, setShowNoteDetails] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showEditNote, setShowEditNote] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [showNotesListModal, setShowNotesListModal] = useState(false);

  // Form State
  const [newNote, setNewNote] = useState<CreateNoteRequest>({
    title: '',
    synopsis: '',
    content: ''
  });
  const [editNote, setEditNote] = useState<CreateNoteRequest>({
    title: '',
    synopsis: '',
    content: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageUploading, setImageUploading] = useState(false);

  // Time slots for the grid
  const timeSlots = ['9:00', '10:00', '11:00', '13:00', '14:00']; // Using 24-hour format for backend
  const timeLabels = ['9AM', '10AM', '11AM', '1PM', '2PM'];

  // Mock authors for the tabs (in real app, this would come from the backend)
  const authors = [
    { id: 'all', name: 'All Notes', avatar: '' },
    { id: user?.id || '', name: `${user?.firstName} ${user?.lastName}`, avatar: user?.avatar || '' }
  ];

  /**
   * Effect: Fetch Notes on Component Mount
   */
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  /**
   * Organize Notes by Time Slot
   * 
   * Groups notes by their assigned time slots. Notes are placed in their
   * specific time slot rather than distributed across all slots.
   */
  const organizeNotesByTime = () => {
    const organized: { [key: string]: Note[] } = {};
    timeSlots.forEach(slot => {
      organized[slot] = [];
    });

    // Place notes in their assigned time slots
    notes.forEach((note) => {
      if (note.timeSlot && timeSlots.includes(note.timeSlot)) {
        organized[note.timeSlot].push(note);
      } else {
        // If no timeSlot is assigned, place in the first available slot for demo
        const firstEmptySlot = timeSlots.find(slot => organized[slot].length === 0);
        if (firstEmptySlot) {
          organized[firstEmptySlot].push(note);
        }
      }
    });

    return organized;
  };

  const notesData = organizeNotesByTime();

  /**
   * Handle Note Click - Show Details Panel
   */
  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setShowNoteDetails(true);
  };

  /**
   * Handle Time Slot Click - Show Add Note Modal
   */
  const handleTimeSlotClick = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setShowAddNote(true);
  };

  /**
   * Handle Image Upload
   */
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    try {
      const uploadResult = await uploadImageToCloudinary(file);
      setUploadedImage(uploadResult.secure_url);
      
      // Add image to content
      setNewNote(prev => ({
        ...prev,
        content: prev.content + `\n\n![Uploaded Image](${uploadResult.secure_url})`
      }));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  /**
   * Handle Image URL
   */
  const handleImageUrl = () => {
    if (imageUrl.trim()) {
      setUploadedImage(imageUrl.trim());
      setNewNote(prev => ({
        ...prev,
        content: prev.content + `\n\n![Image](${imageUrl.trim()})`
      }));
      setImageUrl('');
    }
  };

  /**
   * Handle Remove Image
   */
  const handleRemoveImage = () => {
    if (uploadedImage) {
      setNewNote(prev => ({
        ...prev,
        content: prev.content.replace(`\n\n![Uploaded Image](${uploadedImage})`, '').replace(`\n\n![Image](${uploadedImage})`, '')
      }));
      setUploadedImage(null);
      setImageUrl('');
    }
  };

  /**
   * Handle Add Note
   */
  const handleAddNote = async () => {
    if (newNote.title.trim() && newNote.synopsis.trim() && newNote.content.trim()) {
      try {
        const noteWithTimeSlot = {
          ...newNote,
          timeSlot: selectedTimeSlot // Add the selected time slot to the note
        };
        await createNote(noteWithTimeSlot);
        setNewNote({ title: '', synopsis: '', content: '' });
        setUploadedImage(null);
        setImageUrl('');
        setShowAddNote(false);
        setSelectedTimeSlot('');
        fetchNotes(); // Refresh notes
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    }
  };

  /**
   * Handle Edit Note
   */
  const handleEditNote = () => {
    if (selectedNote) {
      setEditNote({
        title: selectedNote.title,
        synopsis: selectedNote.synopsis || '',
        content: selectedNote.content
      });
      setShowEditNote(true);
      setShowNoteDetails(false);
    }
  };

  /**
   * Handle Update Note
   */
  const handleUpdateNote = async () => {
    if (selectedNote && editNote.title.trim() && editNote.synopsis.trim() && editNote.content.trim()) {
      try {
        await updateNote(selectedNote.id, editNote);
        setEditNote({ title: '', synopsis: '', content: '' });
        setShowEditNote(false);
        setSelectedNote(null);
        fetchNotes(); // Refresh notes
      } catch (error) {
        console.error('Failed to update note:', error);
      }
    }
  };

  /**
   * Handle Delete Note
   */
  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        setShowNoteDetails(false);
        setSelectedNote(null);
        fetchNotes(); // Refresh notes
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            {/* <Typography variant="h4" sx={{ fontWeight: 300, color: '#333' }}>
              Notely
            </Typography> */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              {/* <Button
                variant="outlined"
                onClick={() => setShowNotesListModal(true)}
                sx={{ 
                  ml: 121,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    bgcolor: '#1976d2',
                    color: 'white'
                  }
                }}
              >
                View All Notes
              </Button> */}
              {/* <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} total
              </Typography> */}
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{mt: -5}}>
            Your daily notes
          </Typography>
        </Box>

        {/* Author Tabs */}
        <Box sx={{ display: 'flex', gap: 3, mb: 4, overflowX: 'auto', pb: 1 }}>
          {authors.map((author) => (
            <Box
              key={author.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                cursor: 'pointer',
                minWidth: 80,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
              onClick={() => setSelectedAuthor(author.id)}
            >
              <Avatar
                src={author.avatar || `https://ui-avatars.com/api/?name=${author.name}&background=random`}
                sx={{
                  width: 56,
                  height: 56,
                  boxShadow: selectedAuthor === author.id ? 3 : 1,
                  border: selectedAuthor === author.id ? '3px solid #1976d2' : 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
              />
              <Typography variant="caption" sx={{ fontWeight: 500, textAlign: 'center' }}>
                {author.name}
              </Typography>
              {selectedAuthor === author.id && (
                <Box sx={{ width: 4, height: 4, bgcolor: '#1976d2', borderRadius: '50%' }} />
              )}
            </Box>
          ))}
        </Box>

        {/* Time Grid */}
        <Grid container spacing={2}>
          {/* Time Labels Column - Only show on desktop */}
          <Grid item md={2} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2
            }}>
              {timeLabels.map((time, index) => (
                <Box key={time} sx={{ 
                  height: 120, 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  pt: 1 
                }}>
                  <Chip
                    label={time}
                    sx={{
                      bgcolor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 600,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Notes Columns */}
          <Grid item xs={12} md={10}>
            <Grid container spacing={2}>
              {/* On mobile/tablet, show all time slots in a single column */}
              <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {timeSlots.map((time) => (
                    <Box key={time} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={timeLabels[timeSlots.indexOf(time)]}
                        sx={{
                          bgcolor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          minWidth: 60
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <TimeSlot
                          time={time}
                          notes={notesData[time] || []}
                          onNoteClick={handleNoteClick}
                          onTimeSlotClick={handleTimeSlotClick}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Grid>
              
              {/* On desktop, show the grid layout */}
              {Array.from({ length: 6 }, (_, colIndex) => (
                <Grid item md={2} key={colIndex} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {timeSlots.map((time) => (
                      <TimeSlot
                        key={time}
                        time={time}
                        notes={notesData[time] || []}
                        onNoteClick={handleNoteClick}
                        onTimeSlotClick={handleTimeSlotClick}
                      />
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>

      {/* Note Details Drawer */}
      <Drawer
        anchor="right"
        open={showNoteDetails}
        onClose={() => setShowNoteDetails(false)}
        PaperProps={{
          sx: { 
            width: 400, 
            p: 3,
            bgcolor: '#f5f1eb' // Light orange background for pop-up cards
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Note Details</Typography>
          <IconButton onClick={() => setShowNoteDetails(false)}>
            <XIcon />
          </IconButton>
        </Box>

        {selectedNote && (
          <>
            {/* Author Profile */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                src={selectedNote.author?.avatar || `https://ui-avatars.com/api/?name=${selectedNote.author?.firstName}+${selectedNote.author?.lastName}&background=random`}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6">
                {selectedNote.author?.firstName} {selectedNote.author?.lastName}
              </Typography>
            </Box>

            {/* Note Content */}
            <Paper sx={{ p: 2, mb: 3, bgcolor: '#e3f2fd' }}>
              <Typography variant="h6" gutterBottom>
                {selectedNote.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedNote.synopsis}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedNote.content}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ClockIcon sx={{ fontSize: 16 }} />
                  <Typography variant="caption">
                    {formatDate(selectedNote.createdAt)}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleDeleteNote(selectedNote.id)}
                  color="error"
                  size="small"
                >
                  <Trash2Icon />
                </IconButton>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleEditNote}
              >
                Edit Note
              </Button>
              <Button variant="outlined" fullWidth onClick={() => setShowAddNote(true)}>
                Add New Note
              </Button>
            </Box>
          </>
        )}
      </Drawer>

      {/* Add Note Modal */}
      <Dialog
        open={showAddNote}
        onClose={() => setShowAddNote(false)}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600} // Full screen on mobile
        PaperProps={{
          sx: { 
            minHeight: { xs: '100vh', sm: '600px' },
            bgcolor: '#f5f1eb' // Light orange background for pop-up cards
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Add Note for {timeLabels[timeSlots.indexOf(selectedTimeSlot)] || selectedTimeSlot}
          </Typography>
          <IconButton onClick={() => setShowAddNote(false)}>
            <XIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Author Profile */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Avatar
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6">
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>

          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              required
              fullWidth
            />

            <TextField
              label="Synopsis"
              value={newNote.synopsis}
              onChange={(e) => setNewNote(prev => ({ ...prev, synopsis: e.target.value }))}
              required
              fullWidth
              multiline
              rows={2}
              helperText="A brief summary of your note"
            />

            {/* Image Upload Section */}
            <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add Image (Optional)
              </Typography>
              
              {uploadedImage ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={uploadedImage}
                    sx={{ width: 60, height: 60 }}
                    variant="rounded"
                  />
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    Image added successfully
                  </Typography>
                  <IconButton onClick={handleRemoveImage} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Upload from device */}
                  <Box sx={{ textAlign: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={imageUploading ? <CircularProgress size={20} /> : <CloudUpload />}
                        disabled={imageUploading}
                        fullWidth
                      >
                        {imageUploading ? 'Uploading...' : 'Upload from Device'}
                      </Button>
                    </label>
                  </Box>
                  
                  {/* Divider */}
                  {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                    <Typography variant="caption" sx={{ color: '#666' }}>OR</Typography>
                    <Box sx={{ flex: 1, height: '1px', bgcolor: '#ddd' }} />
                  </Box>
                  
                  Image URL
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Image URL"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      size="small"
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      onClick={handleImageUrl}
                      disabled={!imageUrl.trim()}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      Add
                    </Button>
                  </Box> */}
                </Box>
              )}
            </Box>

            <TextField
              label="Content"
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              required
              fullWidth
              multiline
              rows={6}
              helperText="Write your note content"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowAddNote(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddNote}
            variant="contained"
            disabled={!newNote.title.trim() || !newNote.synopsis.trim() || !newNote.content.trim() || loading}
          >
            {loading ? 'Creating...' : 'Create Note'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Note Modal */}
      <Dialog
        open={showEditNote}
        onClose={() => setShowEditNote(false)}
        maxWidth="md"
        fullWidth
        fullScreen={window.innerWidth < 600} // Full screen on mobile
        PaperProps={{
          sx: { 
            minHeight: { xs: '100vh', sm: '600px' },
            bgcolor: '#f5f1eb' // Light orange background for pop-up cards
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Edit Note
          </Typography>
          <IconButton onClick={() => setShowEditNote(false)}>
            <XIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Title"
              value={editNote.title}
              onChange={(e) => setEditNote(prev => ({ ...prev, title: e.target.value }))}
              required
              fullWidth
              helperText="Enter a descriptive title for your note"
            />

            <TextField
              label="Synopsis"
              value={editNote.synopsis}
              onChange={(e) => setEditNote(prev => ({ ...prev, synopsis: e.target.value }))}
              required
              fullWidth
              helperText="Brief summary of your note"
            />

            <TextField
              label="Content"
              value={editNote.content}
              onChange={(e) => setEditNote(prev => ({ ...prev, content: e.target.value }))}
              required
              fullWidth
              multiline
              rows={6}
              helperText="Write your note content"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowEditNote(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateNote}
            variant="contained"
            disabled={!editNote.title.trim() || !editNote.synopsis.trim() || !editNote.content.trim() || loading}
          >
            {loading ? 'Updating...' : 'Update Note'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notes List Modal */}
      <NotesListModal
        open={showNotesListModal}
        onClose={() => setShowNotesListModal(false)}
        title="Recent Notes"
      />
    </Box>
  );
};

export default NotesPage;