import { Container, Grid, makeStyles, Typography } from "@material-ui/core";
import Image from "next/image";
import React from "react";
import { useCounter } from "react-use";
import ProgressBar from "./ProgressBar";
import RatingDialog from "./RatingDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
  },
  img: {
    borderRadius: "3%",
  },
}));

export default function Track({
  name,
  album,
  artists,
  imgSrc,
  progressPerc,
  trackID,
}) {
  const classes = useStyles();
  const [progress, { inc: incProgress, set: setProgress }] = useCounter(
    progressPerc,
    100,
    0
  );
  const [openRatingDialog, setOpenRatingDialog] = React.useState(true);

  React.useEffect(() => {
    setProgress(progressPerc);
    const timer = setInterval(() => {
      incProgress(0.1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [progressPerc]);

  return (
    <Container className={classes.root}>
      <Grid container direction="column">
        <Grid container item justify="center">
          <Grid item>
            <Typography variant="h4" align="center" gutterBottom>
              {album}
            </Typography>
          </Grid>
          <Grid item>
            <Image
              src={imgSrc}
              alt="Album artwork"
              width={350}
              height={350}
              className={classes.img}
            />
            <ProgressBar progress={progress > 100 ? 100 : progress} />
          </Grid>
        </Grid>
        <Grid item>
          <Typography variant="h5" align="center">
            {name}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {artists.join(", ")}
          </Typography>
        </Grid>
      </Grid>
      <RatingDialog
        name={name}
        open={openRatingDialog && progress > 70}
        setOpen={setOpenRatingDialog}
        trackID={trackID}
      />
    </Container>
  );
}
