"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { dockerCraftTheme } from "@/lib/theme";

export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={dockerCraftTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
