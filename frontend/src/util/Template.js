import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

export default function Thing() {
  const classes = useStyles();
  return <div className={classes.root}></div>;
}
