import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    backgroundColor: (props) => props.color,
    margin: "2px",
    height: "2ch",
    width: "4ch",
    maxWidth: "4ch",
  },
});

export default function VibeCell(props) {
  const classes = useStyles(props);

  return <div className={classes.root}></div>;
}
