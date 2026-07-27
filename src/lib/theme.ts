"use client";

import { createTheme, alpha } from "@mui/material/styles";

const DOCKER_BLUE = "#0db7ed";
const DOCKER_BLUE_DARK = "#0a9ecf";
const BG_BASE = "#0f1117";
const BG_PANEL = "#161b22";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_PRIMARY = "#e6edf3";
const TEXT_SECONDARY = "#7d8fa3";

export const dockerCraftTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: DOCKER_BLUE,
      dark: DOCKER_BLUE_DARK,
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3fb950",
      contrastText: "#ffffff",
    },
    background: {
      default: BG_BASE,
      paper: BG_PANEL,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    divider: BORDER,
    action: {
      hover: alpha(DOCKER_BLUE, 0.08),
      selected: alpha(DOCKER_BLUE, 0.15),
      focus: alpha(DOCKER_BLUE, 0.12),
    },
  },

  typography: {
    fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { color: TEXT_SECONDARY },
    subtitle2: { color: TEXT_SECONDARY },
    caption: { color: TEXT_SECONDARY },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
        "::-webkit-scrollbar": { width: "4px", height: "4px" },
        "::-webkit-scrollbar-track": { background: "transparent" },
        "::-webkit-scrollbar-thumb": { background: BORDER, borderRadius: "100px" },
        "::-webkit-scrollbar-thumb:hover": { background: "#3a4a5e" },
        "::selection": {
          background: alpha(DOCKER_BLUE, 0.25),
          color: "#ffffff",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: BG_PANEL,
          backgroundImage: "none",
          borderBottom: `1px solid ${BORDER}`,
          boxShadow: "none",
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "52px !important",
          paddingLeft: "16px !important",
          paddingRight: "16px !important",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.8rem",
          minHeight: 40,
          padding: "6px 14px",
          color: TEXT_SECONDARY,
          "&.Mui-selected": {
            color: DOCKER_BLUE,
          },
          "&:hover": {
            color: TEXT_PRIMARY,
            opacity: 1,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: DOCKER_BLUE,
          height: 2,
        },
        root: {
          minHeight: 40,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 6,
        },
        outlinedPrimary: {
          borderColor: alpha(DOCKER_BLUE, 0.4),
          "&:hover": {
            borderColor: DOCKER_BLUE,
            backgroundColor: alpha(DOCKER_BLUE, 0.08),
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          "&:hover": {
            backgroundColor: alpha(DOCKER_BLUE, 0.08),
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontSize: "0.7rem",
          height: 22,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: alpha(DOCKER_BLUE, 0.15),
          color: DOCKER_BLUE,
          border: `1px solid ${alpha(DOCKER_BLUE, 0.3)}`,
        },
        colorSuccess: {
          backgroundColor: "rgba(63, 185, 80, 0.12)",
          color: "#3fb950",
          border: "1px solid rgba(63, 185, 80, 0.25)",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: BG_PANEL,
          border: `1px solid ${BORDER}`,
        },
        elevation1: {
          backgroundColor: BG_ELEVATED,
          border: `1px solid ${BORDER}`,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: BG_PANEL,
          backgroundImage: "none",
          borderLeft: `1px solid ${BORDER}`,
          width: 420,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: BORDER,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: BG_ELEVATED,
          color: TEXT_PRIMARY,
          border: `1px solid ${BORDER}`,
          fontSize: "0.75rem",
          borderRadius: 4,
        },
        arrow: {
          color: BG_ELEVATED,
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: BG_ELEVATED,
          backgroundImage: "none",
          border: `1px solid ${BORDER}`,
          boxShadow: "none",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            margin: 0,
          },
        },
      },
    },

    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 44,
          "&.Mui-expanded": { minHeight: 44 },
        },
        content: {
          margin: "10px 0",
          "&.Mui-expanded": { margin: "10px 0" },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: DOCKER_BLUE,
          textDecorationColor: alpha(DOCKER_BLUE, 0.4),
          "&:hover": {
            color: DOCKER_BLUE_DARK,
          },
        },
      },
    },
  },
});
