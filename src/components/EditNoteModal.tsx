import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import { Close, CloudUpload, Delete } from '@mui/icons-material';
import { useNoteStore } from '../stores/noteStore';
import { UpdateNoteRequest, Note } from '../types/Note';
import { uploadImageToCloudinary } from '../utils/cloudinary';

interface EditNoteModalProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  open,
  note,
  onClose,
  onSuccess
}) => {
  const { updateNote, loading, error } = useNoteStore();
  const [formData, setFormData] = useState<UpdateNoteRequest>({
    title: '',
    synopsis: '',
    content: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (note && open) {
      setFormData({
        title: note.title,
        synopsis: note.synopsis,
        content: note.content
      });
      
      // Check if content contains an image
      const imageMatch = note.content.match(/!\[.*?\]\((.*?)\)/);
      if (imageMatch) {
        setUploadedImage(imageMatch[1]);
      }
    }
  }, [note, open]);

  const handleInputChange = (field: keyof UpdateNoteRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    
    try {
      const uploadResult = await uploadImageToCloudinary(file);
      
      // Remove old image if exists
      if (uploadedImage) {
        setFormData(prev => ({
          ...prev,
          content: prev.content.replace(`\n\n![Uploaded Image](${uploadedImage})`, '')
        }));
      }
      
      setUploadedImage(uploadResult.secure_url);
      // Add new image to content
      setFormData(prev => ({
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

  const handleRemoveImage = () => {
    if (uploadedImage) {
      // Remove image markdown from content
      setFormData(prev => ({
        ...prev,
        content: prev.content.replace(`\n\n![Uploaded Image](${uploadedImage})`, '').replace(`![Uploaded Image](${uploadedImage})`, '')
      }));
      setUploadedImage(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!note) return;
    
    try {
      await updateNote(note.id, formData);
      handleClose();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      synopsis: '',
      content: ''
    });
    setUploadedImage(null);
    onClose();
  };

  const isFormValid = formData.title.trim() && formData.synopsis.trim() && formData.content.trim();

  if (!note) return null;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          Edit Note
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              required
              fullWidth
              variant="outlined"
            />

            <TextField
              label="Synopsis"
              value={formData.synopsis}
              onChange={handleInputChange('synopsis')}
              required
              fullWidth
              multiline
              rows={2}
              variant="outlined"
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
                    Image uploaded successfully
                  </Typography>
                  <IconButton onClick={handleRemoveImage} color="error" size="small">
                    <Delete />
                  </IconButton>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload-edit"
                    type="file"
                    onChange={handleImageUpload}
                    disabled={imageUploading}
                  />
                  <label htmlFor="image-upload-edit">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={imageUploading ? <CircularProgress size={20} /> : <CloudUpload />}
                      disabled={imageUploading}
                    >
                      {imageUploading ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </label>
                </Box>
              )}
            </Box>

            <TextField
              label="Content"
              value={formData.content}
              onChange={handleInputChange('content')}
              required
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              helperText="Write your note content in Markdown format"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Updating...' : 'Update Note'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

