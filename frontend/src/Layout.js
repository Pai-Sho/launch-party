import { AppBar, Container, makeStyles } from "@material-ui/core";
import React from "react";
import LinkTypography from "./Link";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: theme.palette.grey[300],
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
        <LinkTypography
          href="/"
          typographyProps={{ variant: "h4", align: "center" }}
        >
          Launch Party
        </LinkTypography>
      </AppBar>
      <Container maxWidth="sm" className={classes.container}>
        {children}
      </Container>
    </div>
  );
};

export default Layout;
