import { grey, red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: grey[400],
      main: "#000A12",
      dark: grey[900],
    },
    secondary: {
      main: "#64FFDA",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#263238",
    },
    text: {
      primary: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Helvetica",
    body1: {
      fontSize: "1.1rem",
    },
    h1: {
      fontSize: "2.4rem",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "1.4rem",
      fontWeight: "bold",
    },
    h6: {
      fontWeight: 100,
    },
    subtitle1: {
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    subtitle2: {
      fontSize: "1.1rem",
      lineHeight: 1.3,
    },
  },
});

export default theme;
