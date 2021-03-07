import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import { useEffectOnce, useInterval } from "react-use";
import EmojiCard from "../src/EmojiCard";
import Layout from "../src/Layout";
import ReactionText from "../src/ReactionText";
import { fetcher } from "../src/services/api";
import Track from "../src/Track";
import Vibemeter from "../src/vibemeter/Vibemeter";

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: "90vh",
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  music: {
    flexGrow: 1,
  },
  reactionTextGrid: {
    maxHeight: "1ch",
  },
}));

export default function Party() {
  const classes = useStyles();
  const [currentEmojiVal, setCurrentEmojiVal] = React.useState(0);
  const [cellColor, setCellColor] = React.useState("teal");

  const [currentTrack, setCurrenetTrack] = React.useState({
    track_id: "",
    track_name: "",
    album_name: "",
    artists: [""],
    artwork: "https://i.scdn.co/image/ab67616d0000b2733e0698e4ae5ffb82a005aeeb",
    progress_ms: 1000,
    duration_ms: 10000,
  });

  useEffectOnce(() => {
    fetcher("get_user_current_track").then((res) => setCurrenetTrack(res.data));
  });

  useInterval(() => {
    fetcher("get_user_current_track").then((res) => setCurrenetTrack(res.data));
  }, 5000);

  console.log(currentEmojiVal);
  return (
    <Layout>
      <Grid
        container
        spacing={2}
        className={classes.grid}
        justify="space-between"
        direction="column"
      >
        <Grid item className={classes.music}>
          <Track
            name={currentTrack.track_name}
            album={currentTrack.album_name}
            artists={currentTrack.artists}
            imgSrc={currentTrack.artwork}
            progressPerc={
              (currentTrack.progress_ms / currentTrack.duration_ms) * 100
            }
            trackID={currentTrack.track_id}
          />
        </Grid>
        <Grid item className={classes.reactionTextGrid}>
          <ReactionText val={currentEmojiVal} />
        </Grid>
        <Grid item>
          <Vibemeter cellColor={cellColor} setCellColor={setCellColor} />
        </Grid>
        <Grid item>
          <EmojiCard
            trackID={currentTrack.track_id}
            elapsed={currentTrack.progress_ms}
            setVal={setCurrentEmojiVal}
            setCellColor={setCellColor}
          />
        </Grid>
      </Grid>
    </Layout>
  );
}
