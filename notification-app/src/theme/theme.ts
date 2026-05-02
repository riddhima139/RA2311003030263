import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#9B94FF',
      dark: '#4A43CC',
    },
    secondary: {
      main: '#FF6584',
      light: '#FF93A8',
      dark: '#CC3D5A',
    },
    background: {
      default: '#0D0D1A',
      paper: '#13132B',
    },
    success: {
      main: '#00E5A0',
    },
    warning: {
      main: '#FFB800',
    },
    error: {
      main: '#FF4D6A',
    },
    text: {
      primary: '#E8E8FF',
      secondary: '#9999BB',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(19,19,43,0.95) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(108,99,255,0.25)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: '0.03em',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%)',
          boxShadow: '0 4px 15px rgba(108,99,255,0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A43CC 0%, #6C63FF 100%)',
            boxShadow: '0 6px 20px rgba(108,99,255,0.55)',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          display: 'flex',
          justifyContent: 'center',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0D0D1A',
          borderRight: '1px solid rgba(108,99,255,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(13,13,26,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(108,99,255,0.2)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default theme;
