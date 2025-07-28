/**
 * NOTELY FRONTEND APPLICATION - MAIN APP COMPONENT
 * 
 * This is the root component of the Notely React application. It sets up the core
 * application structure including routing, theming, and layout. This component
 * serves as the entry point for the entire user interface.
 * 
 * Key Features:
 * - React Router for client-side navigation
 * - Material-UI theming with light/dark mode toggle
 * - Protected routes for authenticated content
 * - Responsive layout with consistent styling
 * - Global CSS baseline for consistent rendering
 * 
 * Architecture Pattern: This follows the Container/Presentational pattern where
 * this component acts as the main container orchestrating the entire application.
 */

import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, Box, PaletteMode } from '@mui/material';
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

/**
 * Main App Component
 * 
 * This component orchestrates the entire application by providing:
 * - Theme management (light/dark mode)
 * - Routing configuration
 * - Layout structure
 * - Global styling baseline
 * 
 * State Management:
 * - Theme mode (light/dark) stored in component state
 * - Authentication state managed by ProtectedRoute components
 * - Individual page state managed by respective page components
 */
const App = () => {
  // Theme mode state - controls light/dark theme switching
  // PaletteMode is a Material-UI type that ensures type safety
  const [mode, setMode] = useState<PaletteMode>('light');

  /**
   * Theme Configuration
   * 
   * Uses useMemo to optimize theme creation - only recreates the theme
   * when the mode changes. This prevents unnecessary re-renders of all
   * components that consume the theme context.
   * 
   * The getTheme function (imported from ./theme) creates a customized
   * Material-UI theme based on the current mode (light/dark).
   */
  const theme = useMemo(() => getTheme(mode), [mode]);

  /**
   * Theme Toggle Function
   * 
   * Switches between light and dark themes by updating the mode state.
   * This function is passed down to the Header component where the
   * theme toggle button is located.
   */
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    /**
     * ThemeProvider - Material-UI Theme Context
     * 
     * Provides the theme configuration to all child components.
     * This enables consistent styling and theme-aware components
     * throughout the application.
     */
    <ThemeProvider theme={theme}>
      {/**
       * CssBaseline - Global CSS Reset
       * 
       * Provides a consistent CSS baseline across different browsers.
       * This component removes default browser styling and applies
       * Material-UI's baseline styles for consistent rendering.
       */}
      <CssBaseline />
      
      {/**
       * Router - Client-Side Navigation
       * 
       * BrowserRouter enables client-side routing using the HTML5 history API.
       * This allows for clean URLs without hash fragments and provides
       * a native browser navigation experience.
       */}
      <Router>
        {/**
         * Main Layout Container
         * 
         * This Box component creates the main application layout:
         * - Full viewport height (minHeight: '100vh')
         * - Flexbox column layout for header and content stacking
         * - Theme-aware background color
         */}
        <Box
          sx={{
            minHeight: '100vh',        // Ensure full viewport height
            display: 'flex',           // Enable flexbox layout
            flexDirection: 'column',   // Stack header and content vertically
            bgcolor: 'background.default' // Use theme's default background color
          }}
        >
          {/**
           * Header Component
           * 
           * Contains navigation, branding, and theme toggle functionality.
           * The toggleTheme function is passed as a prop to enable theme switching.
           */}
          <Header toggleTheme={toggleTheme} />
          
          {/**
           * Main Content Container
           * 
           * Material-UI Container component that provides:
           * - Responsive max-width based on breakpoints
           * - Consistent horizontal padding
           * - Flexbox layout for content organization
           */}
          <Container
            maxWidth="lg"              // Large breakpoint max-width
            sx={{
              flex: 1,                 // Take remaining vertical space
              py: 3,                   // Vertical padding (theme spacing units)
              display: 'flex',         // Enable flexbox for content
              flexDirection: 'column'  // Stack content vertically
            }}
          >
            {/**
             * Application Routes
             * 
             * Defines all the routes and their corresponding components.
             * Routes are organized by access level:
             * - Public routes: Landing, Login, Register
             * - Protected routes: Notes, Note Detail, Profile
             */}
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

