

import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider,
  //  createTheme,
  
  CssBaseline, Container, Box, PaletteMode } from '@mui/material';
import { Header } from './components/Header';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import ProfilePage from './pages/ProfilePage';
import TrashPage from './pages/TrashPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { getTheme } from './theme';


const App = () => {
  
  const [mode, setMode] = useState<PaletteMode>('light');

  const theme = useMemo(() => getTheme(mode), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    
    <ThemeProvider theme={theme}>
      
      <CssBaseline />
      
      
      <Router>
        
        <Box
          sx={{
            minHeight: '100vh',        
            display: 'flex',          
            flexDirection: 'column',  
            bgcolor: 'background.default' 
          }}
        >
          
          <Header toggleTheme={toggleTheme} />
          
          
          <Container
            maxWidth="lg"              
            sx={{
              flex: 1,                 
              py: 3,                   
              display: 'flex',         
              flexDirection: 'column'  
            }}
          >
            
            <Routes>
              {/* Public Routes - Accessible without authentication */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes - Require authentication */}
              <Route
                path="/notes"
                element={
                  <ProtectedRoute>
                    <NotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notes/:id"
                element={
                  <ProtectedRoute>
                    <NoteDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/trash"
                element={
                  <ProtectedRoute>
                    <TrashPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;

