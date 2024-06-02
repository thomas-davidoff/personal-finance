import { PaletteMode } from "@mui/material"

export const apiColors = {
  "Dark Blue": "#3495eb",
}

export const tokens = {
  grey: {
    100: "#f0f0f3",
    200: "#e1e2e7",
    300: "#d1d3da",
    400: "#c2c5ce",
    500: "#b3b6c2",
    600: "#8f929b",
    700: "#6b6d74",
    800: "#48494e",
    900: "#242427",
  },
  primary: {
    100: "#dbe0f3",
    200: "#b7c1e7",
    300: "#93a3da",
    400: "#6f84ce",
    500: "#4b65c2",
    600: "#3c519b",
    700: "#2d3d74",
    800: "#1e284e",
    900: "#0f1427",
  },
  secondary: {
    100: "#ffccd5",
    200: "#ff99ac",
    300: "#ff6682",
    400: "#ff3359",
    500: "#ff002f",
    600: "#cc0026",
    700: "#99001c",
    800: "#660013",
    900: "#330009",
  },
  tertiary: {
    // purple
    500: "#8884d8",
  },
  background: {
    light: "#101825",
    main: "#010813",
  },
}

const mode: PaletteMode = "dark"

export const themeSettings = {
  palette: {
    mode,
    primary: {
      ...tokens.primary,
      main: tokens.primary[200],
      light: tokens.primary[100],
    },
    secondary: {
      ...tokens.secondary,
      main: tokens.secondary[500],
    },
    tertiary: {
      ...tokens.tertiary,
    },
    grey: {
      ...tokens.grey,
      main: tokens.grey[500],
    },
    background: {
      default: tokens.background.main,
      light: tokens.background.light,
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 32,
    },
    h2: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 24,
    },
    h3: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 800,
      color: tokens.grey[200],
    },
    h4: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
      color: tokens.grey[300],
    },
    h5: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      fontWeight: 400,
      color: tokens.grey[500],
    },
    h6: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 10,
      color: tokens.grey[700],
    },
    error: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      color: tokens.tertiary,
    },
  },
}
