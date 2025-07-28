import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Create as CreateIcon,
  Delete as TrashIcon
} from '@mui/icons-material';
import { useAuthStore } from '../stores/authStore';
import { ProfileModal } from './ProfileModal';

interface HeaderProps {
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleTheme }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    setProfileModalOpen(true);
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?';
  };

  return (
    <AppBar position="sticky" sx={{
      // background: "linear-gradient(135deg, #801b3bff, #1d2671 100%)",
      background: "black",
      borderRadius: 0,
    }}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            marginTop: -3,
            flexGrow: 1, 
            fontSize: 42,
            fontWeight: 400,
            fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
            background: "linear-gradient(45deg, #ff6a00, #f7bb97)",
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '2px',
            transform: 'rotate(-2deg)',
            '&:hover': {
              transform: 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }
          }} 
        >
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none',  }}>
            Notely
          </Link>
        </Typography>

        <IconButton sx={{ mr: 1 }} onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/notes"
              sx={{ 
                fontSize: 19,
                fontWeight: 700,
                background: "linear-gradient(45deg, #ff6a00, #f7bb97)",
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              My Notes
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/trash"
              startIcon={<TrashIcon />}
              sx={{ 
                fontSize: 16,
                fontWeight: 600,
                background: "linear-gradient(45deg, #ff6a00, #f7bb97)",
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Trash
            </Button>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              {user?.avatar ? (
                <Avatar 
                  src={user.avatar} 
                  alt={user.username}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {getInitials(user?.firstName, user?.lastName)}
                </Avatar>
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              variant="outlined"
            >
              Login
            </Button>
            <Button 
              color="secondary" 
              component={Link} 
              to="/register"
              variant="contained"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
      
      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </AppBar>
  );
};

