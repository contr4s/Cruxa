import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface ThemeOptions {
    custom?: {
      surface2?: string;
      surface3?: string;
      border?: string;
      gradientAccent?: string;
      gradientHero?: string;
    };
  }
  interface Theme {
    custom: {
      surface2: string;
      surface3: string;
      border: string;
      gradientAccent: string;
      gradientHero: string;
    };
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#26A69A',
      light: '#4DB6AC',
      dark: '#00897B',
    },
    secondary: {
      main: '#FFB300',
    },
    background: {
      default: '#121212',
      paper: '#1C2221',
    },
    text: {
      primary: '#F0F0F0',
      secondary: '#BDBDBD',
    },
    divider: '#2D3D3A',
  },
  custom: {
    surface2: '#26302E',
    surface3: '#2D3A37',
    border: '#2D3D3A',
    gradientAccent: 'linear-gradient(135deg, #26A69A, #2ECC71)',
    gradientHero: 'linear-gradient(180deg, rgba(38,166,154,.08) 0%, transparent 60%)',
  },
  typography: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: '-1.5px',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '-.5px',
    },
    h3: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '0.95rem',
    },
    body2: {
      fontSize: '0.88rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflowX: 'hidden',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          fontSize: '0.85rem',
          padding: '8px 18px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
  },
});
