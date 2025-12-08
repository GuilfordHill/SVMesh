import { createTheme } from "@mui/material/styles";

// Extend the theme to include custom colors
declare module "@mui/material/styles" {
  interface Palette {
    cream: Palette["primary"];
  }

  interface PaletteOptions {
    cream?: PaletteOptions["primary"];
  }
}

export const theme = createTheme({
  palette: {
    mode: "light", // Changed from dark to light
    background: {
      default: "#f6eedf", // Main background color
      paper: "#faf6f0", // Card/paper background color
    },
    primary: {
      main: "#183F41",
    },
    secondary: {
      main: "#3E6347",
    },
  },
});
