import { createTheme, Theme } from '@mui/material/styles';

// Define your color palette
const colors = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  error: '#D0021B',
  warning: '#F5A623',
  info: '#4A90E2',
  success: '#7ED321',
};

const baseTypography = {
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700 },
  h2: { fontWeight: 700 },
  h3: { fontWeight: 700 },
  h4: { fontWeight: 700 },
  h5: { fontWeight: 600 },
  h6: { fontWeight: 600 },
};

const baseShape = {
  borderRadius: 8,
};

// ...existing code...

// Create the light theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.primary },
    secondary: { main: colors.secondary },
    error: { main: colors.error },
    warning: { main: colors.warning },
    info: { main: colors.info },
    success: { main: colors.success },
    background: {
      default: '#F4F7FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#24292E',
      secondary: '#586069',
      disabled: '#959DA5',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: baseTypography,
  shape: baseShape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.primary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid rgba(0, 0, 0, 0.08)`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#E3F2FD', // A light blue shade
            color: colors.primary,
            '&:hover': {
              backgroundColor: '#BBDEFB', // A slightly darker light blue
            },
          },
        },
      },
    },
  },
});

// Create the dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colors.secondary },
    secondary: { main: colors.primary },
    error: { main: colors.error },
    warning: { main: colors.warning },
    info: { main: colors.info },
    success: { main: colors.success },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A9A9A9',
      disabled: '#5A5A5A',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: baseTypography,
  shape: baseShape,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 'bold',
          boxShadow: 'none',
          padding: '10px 20px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: colors.secondary,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid rgba(255, 255, 255, 0.12)`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#424242', // A dark grey shade
            color: colors.secondary,
            '&:hover': {
              backgroundColor: '#616161', // A slightly lighter dark grey
            },
          },
        },
      },
    },
  },
});

export { lightTheme, darkTheme };
