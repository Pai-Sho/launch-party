import { Button, Divider, Grid, makeStyles } from "@material-ui/core";
import { useCounter } from "react-use";
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
    width: "20vw",
    minWidth: "3ch",
    maxWidth: "5ch",
  },
}));

const pickHex = (color1, color2, weight) => {
  // Adapted from: https://stackoverflow.com/a/30144587
  let p = weight;
  let w = p * 2 - 1;
  let w1 = (w / 1 + 1) / 2;
  let w2 = 1 - w1;
  let rgb = [
    Math.round(color1[0] * w1 + color2[0] * w2),
    Math.round(color1[1] * w1 + color2[1] * w2),
    Math.round(color1[2] * w1 + color2[2] * w2),
  ];
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
};

const bad_color = [145, 145, 145];
const middle_color = [158, 255, 255];
const good_color = [100, 255, 218];
const calcCellColor = (vibeScore) => {
  if (vibeScore < 35) {
    let weight = vibeScore / 35;
    return pickHex(bad_color, middle_color, weight);
  }
  let weight = (vibeScore - 35) / 65;
  return pickHex(middle_color, good_color, weight);
};

export default function EmojiCard({ trackID, elapsed, setVal, setCellColor }) {
  const classes = useStyles();
  const [current, { inc, dec }] = useCounter(35, 100, 0);

  const EmojiButton = ({ emoji, val }) => (
    <Grid item>
      <Button
        className={classes.button}
        onClick={() => {
          postReaction(trackID, elapsed, val);
          setVal(val);
          if (val - 2 > 0) {
            inc((val - 1.5) * 200);
          } else {
            dec((2.5 - val) * 200);
          }
          setCellColor(calcCellColor(current));
        }}
      >
        {emoji}
      </Button>
    </Grid>
  );

  return (
    <div className={classes.root}>
      <Divider />
      <Grid container justify="center" className={classes.buttonGrid}>
        <EmojiButton emoji="🤮" val={1} />
        <EmojiButton emoji="👎" val={2} />
        <EmojiButton emoji="👍" val={3} />
        <EmojiButton emoji="🔥" val={4} />
      </Grid>
    </div>
  );
}
