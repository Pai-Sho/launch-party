import { grey, lightGreen, red } from "@material-ui/core/colors";
import { createMuiTheme } from "@material-ui/core/styles";

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: grey[400],
      main: grey[800],
      dark: grey[900],
    },
    secondary: {
      main: lightGreen["A400"],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  typography: {
    body1: {
      fontSize: "1.1rem",
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
