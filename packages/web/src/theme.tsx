import "@fontsource-variable/open-sans/index.css";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  responsiveFontSizes,
} from "@mui/material";
import {
  blueGrey as primary,
  deepPurple as secondary,
} from "@mui/material/colors";
import { type ReactNode } from "react";

const theme = responsiveFontSizes(
  createTheme({
    cssVariables: true,
    colorSchemes: {
      light: {
        palette: {
          primary,
          secondary,
          background: {
            default: "var(--mui-palette-primary-50)",
          },
        },
      },
      dark: {
        palette: {
          primary,
          secondary,
        },
      },
    },
    typography: {
      fontFamily: "'Open Sans Variable', sans-serif",
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: 16,
            alignItems: "center",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 24,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: 8,
          },
        },
      },
      MuiCardActions: {
        styleOverrides: {
          root: {
            justifyContent: "flex-end",
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            padding: 8,
          },
        },
      },
    },
  })
);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
