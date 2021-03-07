import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: theme.spacing(1, 0),
  },
  bar: {
    background: theme.palette.background.default,
  },
}));

export default function LinearDeterminate({ progress }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={progress}
        className={classes.bar}
        color="secondary"
      />
    </div>
  );
}
