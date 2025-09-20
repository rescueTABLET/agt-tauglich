import "@fontsource/roboto/index.css";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as RescueTabletThemeProvider } from "@rescuetablet/theme";
import { type ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <RescueTabletThemeProvider>
      <CssBaseline />
      {children}
    </RescueTabletThemeProvider>
  );
}
