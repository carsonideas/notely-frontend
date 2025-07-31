
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNoteStore } from '../stores/noteStore';
import { Note } from '../types/Note';

interface NotesListModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export const NotesListModal: React.FC<NotesListModalProps> = ({ 
  open, 
  onClose, 
  title = "Recent Notes" 
}) => {
  const { notes, fetchNotes } = useNoteStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);

  useEffect(() => {
    if (open) {
      fetchNotes();
    }
  }, [open, fetchNotes]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.synopsis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchTerm, notes]);

  // Group notes by categories (simplified for demo)
  const categorizeNotes = () => {
    const categories: { [key: string]: Note[] } = {
      'Recent Notes': [],
      'School Essays': [],
      'IG Posts': [],
      'Groceries': [],
      'Other': []
    };

    filteredNotes.forEach((note, index) => {
      // Simple categorization based on keywords or index
      if (note.title.toLowerCase().includes('school') || note.title.toLowerCase().includes('essay')) {
        categories['School Essays'].push(note);
      } else if (note.title.toLowerCase().includes('ig') || note.title.toLowerCase().includes('post')) {
        categories['IG Posts'].push(note);
      } else if (note.title.toLowerCase().includes('grocery') || note.title.toLowerCase().includes('shopping')) {
        categories['Groceries'].push(note);
      } else if (index < 3) {
        categories['Recent Notes'].push(note);
      } else {
        categories['Other'].push(note);
      }
    });

    return categories;
  };

  const categorizedNotes = categorizeNotes();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '450px',
          height: '700px',
          bgcolor: '#f5f1eb', // Beige background to match image
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden'
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <IconButton size="small">
          <MenuIcon sx={{ color: '#666' }} />
        </IconButton>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600,
            fontSize: '18px',
            color: '#2c2c2c'
          }}
        >
          {title}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small">
            <SearchIcon sx={{ color: '#666' }} />
          </IconButton>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon sx={{ color: '#666' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Search Field */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              borderRadius: 2,
              fontSize: '14px'
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: '#999' }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Notes Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        px: 2,
        pb: 2
      }}>
        {Object.entries(categorizedNotes).map(([category, categoryNotes]) => {
          if (categoryNotes.length === 0) return null;
          
          return (
            <Box key={category} sx={{ mb: 3 }}>
              {/* Category Header */}
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#2c2c2c',
                  mb: 1
                }}
              >
                {category}
              </Typography>

              {/* Category Notes */}
              {category === 'Recent Notes' ? (
                // Recent notes with full content preview
                <Box>
                  {categoryNotes.slice(0, 3).map((note) => (
                    <Box key={note.id} sx={{ mb: 2 }}>
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '14px',
                          color: '#2c2c2c',
                          mb: 0.5
                        }}
                      >
                        {note.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '12px',
                          color: '#666',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {note.content}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : category === 'Groceries' ? (
                // Groceries as checklist
                <List dense sx={{ p: 0 }}>
                  {[
                    '2x Apples',
                    '6x Eggs', 
                    '1x Broccoli',
                    '5x Maggie L',
                    '2x Cupcakes',
                    '3x Ball Pens'
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                      <Checkbox 
                        size="small" 
                        sx={{ 
                          p: 0.5,
                          '& .MuiSvgIcon-root': { fontSize: 16 }
                        }} 
                      />
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{
                          fontSize: '13px',
                          color: '#2c2c2c'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                // Other categories as bullet lists
                <List dense sx={{ p: 0 }}>
                  {categoryNotes.map((note) => (
                    <ListItem key={note.id} sx={{ py: 0.25, px: 0 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontSize: '13px',
                          color: '#2c2c2c',
                          '&:before': {
                            content: '"•"',
                            color: '#999',
                            fontWeight: 'bold',
                            display: 'inline-block',
                            width: '1em',
                            marginLeft: '8px'
                          }
                        }}
                      >
                        {note.title}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}

              {/* Special sections */}
              {category === 'IG Posts' && (
                <List dense sx={{ p: 0, mt: 1 }}>
                  <ListItem sx={{ py: 0.25, px: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '13px',
                        color: '#2c2c2c',
                        '&:before': {
                          content: '"•"',
                          color: '#999',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          width: '1em',
                          marginLeft: '8px'
                        }
                      }}
                    >
                      Typography Checklist
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ py: 0.25, px: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontSize: '13px',
                        color: '#2c2c2c',
                        '&:before': {
                          content: '"•"',
                          color: '#999',
                          fontWeight: 'bold',
                          display: 'inline-block',
                          width: '1em',
                          marginLeft: '8px'
                        }
                      }}
                    >
                      Make 3D Card
                    </Typography>
                  </ListItem>
                </List>
              )}

              {/* Lamina Peak section */}
              {category === 'Other' && (
                <Box sx={{ mt: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '14px',
                      color: '#2c2c2c',
                      mb: 0.5
                    }}
                  >
                    Lamina Peak
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: '12px',
                      color: '#666'
                    }}
                  >
                    Lamina Peak (70°32'S 68°45'W) Coordinate
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Dialog>
  );
};

