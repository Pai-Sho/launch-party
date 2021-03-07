import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  text: {
    position: "relative",
    color: "#14cba8",
    fontWeight: "bold",
    fontSize: "18px",
    // zIndex: -10,
    animation: "$textAnimate 1.5s forwards",
  },
  "@keyframes textAnimate": {
    "0%": {
      bottom: "-25px",
      opacity: "0%",
    },
    "50%": {
      bottom: "20px",
      opacity: "100%",
      fontSize: "24px",
    },
    "100%": {
      bottom: "20px",
      opacity: "0%",
    },
  },
}));

function generateTextFromEmojiVal(emojiVal) {
  switch (emojiVal) {
    case 1:
      return "YOU'RE DISGUSTED";
    case 2:
      return "YOU'RE NOT VIBING";
    case 3:
      return "YOU'RE VIBING";
    case 4:
      return "YOU'RE FEELING THE FIRE";
  }
}

export default function ReactionText(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <Typography
        key={Math.random().toString()}
        variant="h5"
        align="center"
        className={classes.text}
      >
        {generateTextFromEmojiVal(props.val)}
      </Typography>
    </div>
  );
}
