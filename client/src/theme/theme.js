import { createTheme } from '@mui/material/styles';

/**
 * Centralized Material-UI theme configuration for Yuthukama
 * Provides consistent design tokens, colors, typography, and component overrides
 */
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1DBF73',
      light: '#26E894',
      dark: '#169c5f',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#404145',
      light: '#62646A',
      dark: '#1E1F23',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#E05555',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    success: {
      main: '#1DBF73',
      light: '#26E894',
      dark: '#169c5f',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#404145',
      secondary: '#62646A',
      disabled: '#95979D',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9375rem',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.1)',
    '0 4px 16px rgba(0,0,0,0.12)',
    '0 6px 20px rgba(0,0,0,0.14)',
    '0 8px 24px rgba(0,0,0,0.16)',
    '0 12px 32px rgba(0,0,0,0.18)',
    '0 16px 40px rgba(0,0,0,0.2)',
    '0 20px 48px rgba(0,0,0,0.22)',
    '0 24px 56px rgba(0,0,0,0.24)',
    '0 28px 64px rgba(0,0,0,0.26)',
    '0 32px 72px rgba(0,0,0,0.28)',
    '0 36px 80px rgba(0,0,0,0.3)',
    '0 40px 88px rgba(0,0,0,0.32)',
    '0 44px 96px rgba(0,0,0,0.34)',
    '0 48px 104px rgba(0,0,0,0.36)',
    '0 52px 112px rgba(0,0,0,0.38)',
    '0 56px 120px rgba(0,0,0,0.4)',
    '0 60px 128px rgba(0,0,0,0.42)',
    '0 64px 136px rgba(0,0,0,0.44)',
    '0 68px 144px rgba(0,0,0,0.46)',
    '0 72px 152px rgba(0,0,0,0.48)',
    '0 76px 160px rgba(0,0,0,0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(29, 191, 115, 0.25)',
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 16px rgba(29, 191, 115, 0.3)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        sizeSmall: {
          padding: '6px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '12px 32px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1DBF73',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1DBF73',
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1DBF73',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(29, 191, 115, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1DBF73',
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: '#E8F5E9',
          color: '#2E7D32',
        },
        standardError: {
          backgroundColor: '#FFEBEE',
          color: '#C62828',
        },
        standardWarning: {
          backgroundColor: '#FFF3E0',
          color: '#E65100',
        },
        standardInfo: {
          backgroundColor: '#E3F2FD',
          color: '#1565C0',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#404145',
          fontSize: '0.875rem',
          borderRadius: 8,
          padding: '8px 12px',
        },
        arrow: {
          color: '#404145',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.5rem',
          fontWeight: 600,
          padding: '24px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px',
        },
      },
    },
  },
});

export default theme;
