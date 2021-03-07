import { Button, Divider, Grid, makeStyles } from "@material-ui/core";
import { postReaction } from "./services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  buttonGrid: {
    margin: theme.spacing(1, 0, 0, 0),
  },
  button: {
    fontSize: "2.5rem",
    width: "10vw",
    maxWidth: "4ch",
  },
}));

export default function EmojiCard() {
  const classes = useStyles();

  const EmojiButton = ({ emoji, val }) => (
    <Grid item>
      <Button className={classes.button} onClick={() => postReaction(val)}>
        {emoji}
      </Button>
    </Grid>
  );

  return (
    <div className={classes.root}>
      <Divider />
      <Grid container justify="space-between" className={classes.buttonGrid}>
        <EmojiButton emoji="🤮" val={0} />
        <EmojiButton emoji="👎" val={1} />
        <EmojiButton emoji="👍" val={2} />
        <EmojiButton emoji="🔥" val={3} />
      </Grid>
    </div>
  );
}
