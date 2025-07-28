/**
 * NOTELY FRONTEND - PROFILE MODAL COMPONENT
 * 
 * This component implements the exact profile modal design as shown in the provided image.
 * Features a clean, modern design with beige background, centered profile card with
 * avatar, name, location, and menu items.
 * 
 * Key Features:
 * - Exact design match with provided image
 * - Clean beige background
 * - Centered profile card layout
 * - Avatar with name and location
 * - Menu items with icons and arrows
 * - Responsive design
 */

import React from 'react';
import {
  Dialog,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  WorkspacePremium as PremiumIcon,
  Edit as EditIcon,
  Palette as ThemeIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const menuItems = [
    {
      icon: <EditIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />,
      text: 'Edit Profile',
      onClick: () => navigate('/profile') // Assuming a profile edit page
    },
    {
      icon: <LogoutIcon sx={{ color: '#ff6b6b', fontSize: 20 }} />,
      text: 'Log Out',
      onClick: handleLogout
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: 300,
          height: 350,
          bgcolor: '#f5f1eb', // Beige background to match image
          borderRadius: 3,
          position: 'absolute',
          top: 16,
          right: 16,
          overflow: 'hidden'
        }
      }}
    >
      {/* Header with NOTELY title */}
      <Box sx={{ 
        textAlign: 'center', 
        pt: 3, 
        pb: 2,
        position: 'relative'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: '18px',
            color: '#4a4a4a',
            letterSpacing: '2px'
          }}
        >
          NOTELY
        </Typography>
        
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#666'
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Profile Section */}
      <Box sx={{ 
        textAlign: 'center', 
        px: 3, 
        pb: 3 
      }}>
        {/* Avatar */}
        <Avatar
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`}
          sx={{
            width: 100,
            height: 100,
            mx: 'auto',
            mb: 2,
            border: '4px solid white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
        
        {/* Name */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: '#2c2c2c',
            mb: 0.5,
            fontSize: '22px'
          }}
        >
          {user?.firstName} {user?.lastName}
        </Typography>
        
        {/* Location */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666',
            fontSize: '14px',
            mb: 3
          }}
        >
          {user?.email || 'Location not set'}
        </Typography>
      </Box>

      {/* Menu Items */}
      <Box sx={{ px: 2 }}>
        <List sx={{ p: 0 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                onClick={item.onClick}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  mb: 0.5,
                  py: 1.5,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease-in-out'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#2c2c2c'
                  }}
                />
                <ChevronRightIcon sx={{ color: '#999', fontSize: 20 }} />
              </ListItem>
              {index < menuItems.length - 1 && (
                <Divider sx={{ mx: 2, bgcolor: 'rgba(0,0,0,0.05)' }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Dialog>
  );
};

