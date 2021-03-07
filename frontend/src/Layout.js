import { AppBar, Container, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    flexGrow: 1,
    margin: theme.spacing(1, 0),
  },
  bar: {
    padding: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
  },
  copyright: {
    margin: theme.spacing(1),
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar className={classes.bar} position="static">
        <Typography variant="h1" align="center">
          LAUNCH PARTY
        </Typography>
      </AppBar>
      <Container maxWidth="sm" className={classes.container}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
