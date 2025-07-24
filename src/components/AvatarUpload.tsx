import React, { useState, useRef } from 'react';
import {
  Box,
  Avatar,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';

interface AvatarUploadProps {
  currentAvatar?: string;
  displayName: string;
  onUploadSuccess?: (avatarUrl: string) => void;
  onUploadError?: (error: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  displayName,
  onUploadSuccess,
  onUploadError,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, updateProfile } = useAuthStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload avatar');
      }

      // Update the user profile with the new avatar URL
      if (data.avatarUrl) {
        await updateProfile({ avatar: data.avatarUrl });
        onUploadSuccess?.(data.avatarUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await updateProfile({ avatar: null });
      onUploadSuccess?.('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove avatar';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={currentAvatar}
          sx={{ 
            width: 120, 
            height: 120,
            border: '3px solid',
            borderColor: 'primary.main',
          }}
        >
          {displayName.charAt(0).toUpperCase()}
        </Avatar>
        
        {uploading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
            }}
          >
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        )}
        
        <IconButton
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
          onClick={handleUploadClick}
          disabled={uploading}
        >
          <PhotoCamera />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleUploadClick}
          disabled={uploading}
          startIcon={<PhotoCamera />}
        >
          {currentAvatar ? 'Change Avatar' : 'Upload Avatar'}
        </Button>
        
        {currentAvatar && (
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleRemoveAvatar}
            disabled={uploading}
            startIcon={<Delete />}
          >
            Remove
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: 300 }}>
          {error}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
        Supported formats: JPG, PNG, GIF (max 5MB)
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </Box>
  );
};

export default AvatarUpload;

