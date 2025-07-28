import { Card, CardContent, Typography, Button, Box, Avatar, Chip, IconButton, Menu, MenuItem } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MoreVert, Edit, Delete, Visibility } from '@mui/icons-material'
import { Note } from '../types/Note'
import { formatDate, getRelativeTime } from '../utils/dateFormat'
import { useAuthStore } from '../stores/authStore'
import { useNoteStore } from '../stores/noteStore'

interface NoteCardProps {
  note: Note
  showActions?: boolean
  onEdit?: () => void
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, showActions = true, onEdit }) => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { deleteNote } = useNoteStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const getInitials = (username: string) => {
    return username?.[0]?.toUpperCase() || '?'
  }

  const getAuthorDisplayName = (note: Note) => {
    if (note.author?.firstName && note.author?.lastName) {
      return `${note.author.firstName} ${note.author.lastName}`
    }
    return note.author?.username || 'Anonymous'
  }

  const isOwner = user?.id === note.authorId

  // Extract first 200 characters of content as preview, removing markdown syntax
  const cleanContent = note.content
    .replace(/[#*`_~\[\]()]/g, '') // Remove basic markdown characters
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove image syntax
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove link syntax
    .trim()

  const preview = cleanContent.length > 200 
    ? `${cleanContent.substring(0, 200)}...`
    : cleanContent

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleView = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    navigate(`/notes/${note.id}`)
  }

  const handleEdit = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    if (onEdit) {
      onEdit()
    } else {
      navigate(`/notes/${note.id}/edit`)
    }
  }

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    handleMenuClose()
    
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await deleteNote(note.id)
        // The note will be removed from the list automatically by the store
      } catch (error) {
        console.error('Failed to delete note:', error)
        alert('Failed to delete note. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Card sx={{ 
      maxWidth: 400, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      opacity: isDeleting ? 0.5 : 1,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      position: 'relative'
    }}>
      {showActions && isOwner && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
          <IconButton
            onClick={handleMenuOpen}
            sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' }
            }}
            disabled={isDeleting}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleView}>
              <Visibility sx={{ mr: 1 }} />
              View
            </MenuItem>
            <MenuItem onClick={handleEdit}>
              <Edit sx={{ mr: 1 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          gutterBottom 
          variant="h5" 
          component="div"
          sx={{ 
            fontWeight: 600,
            lineHeight: 1.3,
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {note.title}
        </Typography>

        {note.synopsis && (
          <Typography 
            variant="body2" 
            color="primary.main"
            sx={{ 
              mb: 1,
              fontWeight: 500,
              fontStyle: 'italic',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {note.synopsis}
          </Typography>
        )}
        
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {preview}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar 
            sx={{ width: 32, height: 32 }}
            src={note.author?.avatar}
          >
            {getInitials(note.author?.username || '')}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
              {getAuthorDisplayName(note)}
            </Typography>
           
          <Typography variant="caption" color="text.secondary">
            @{note.author?.username}
          </Typography>
            <Chip
              label={getRelativeTime(note.dateCreated)}
              size="small"
              variant="outlined"
              title={formatDate(note.dateCreated)}
              sx={{ fontSize: '0.75rem', height: 20,
                  marginLeft: 13, 
                  marginTop: -4,
              }}
            />
          </Box>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          to={`/notes/${note.id}`}
          variant="contained"
          fullWidth
          disabled={isDeleting}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            py: 1
          }}
        >
          {isDeleting ? 'Deleting...' : 'Read Note'}
        </Button>
      </Box>
    </Card>
  )
}

