import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, Toolbar } from '@mui/material';
import theme from './theme/theme';
import Navbar from './components/Navbar';
import AllNotificationsPage from './pages/AllNotificationsPage';
import PriorityPage from './pages/PriorityPage';
import FilterPage from './pages/FilterPage';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            backgroundImage:
              'radial-gradient(ellipse at 20% 10%, rgba(108,99,255,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(255,101,132,0.05) 0%, transparent 60%)',
          }}
        >
          <Navbar />
          {/* Toolbar spacer so content is below fixed AppBar */}
          <Toolbar />
          <Box
            component="main"
            sx={{
              maxWidth: 860,
              mx: 'auto',
              px: { xs: 2, sm: 3, md: 4 },
              py: 3,
            }}
          >
            <Routes>
              <Route path="/" element={<AllNotificationsPage />} />
              <Route path="/priority" element={<PriorityPage />} />
              <Route path="/filter" element={<FilterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
