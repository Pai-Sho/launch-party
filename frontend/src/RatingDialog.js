import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles,
  Slide,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React from "react";
import { postTrackRating } from "./services/api";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  txt: {
    textAlign: "center",
  },
  rating: {
    margin: theme.spacing(1, 0),
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RatingDialog({ name, open, setOpen }) {
  const [value, setValue] = React.useState(0);

  const classes = useStyles();

  const handleClose = () => {
    if (!value) {
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">First impressions</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description" className={classes.txt}>
          Pick a rating for {name ? name : "this track"}.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Grid container justify="center" className={classes.rating}>
          <Rating
            size="large"
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
              postTrackRating(newValue);
              setOpen(false);
            }}
          />
        </Grid>
      </DialogActions>
    </Dialog>
  );
}
