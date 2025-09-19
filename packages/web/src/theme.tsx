import "@fontsource/roboto/index.css";
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import {
  red as error,
  deepPurple as primary,
  deepOrange as secondary,
} from "@mui/material/colors";
import { type ReactNode } from "react";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "media",
  },
  colorSchemes: {
    light: {
      palette: {
        primary,
        secondary,
        error,
        background: {
          default: "#f5f5f5",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: primary[300] },
        secondary: { main: secondary[300] },
        error: { main: error[300] },
        background: {
          default: "#000000",
        },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "1em",
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "filled",
        fullWidth: true,
      },
    },
  },
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { minHeight: "100vh" },
          body: { minHeight: "100vh" },
        }}
      />
      {children}
    </MuiThemeProvider>
  );
}
