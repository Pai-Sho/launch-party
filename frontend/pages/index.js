import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
// import useSWR from "swr";
// import fetcher from "../src/api";
import EmojiCard from "../src/EmojiCard";
import Layout from "../src/Layout";
import { placeHolderData } from "../src/services/Context";
import Track from "../src/Track";

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: "90vh",
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  music: {
    flexGrow: 1,
  },
}));

export default function Index() {
  const classes = useStyles();
  // const { data, error } = useSWR(
  //   "https://api.spotify.com/v1/albums/31VIpzeGAccBcmRTBSJY3Z",
  //   fetcher
  // );
  // console.log(data);
  // console.log(data.images[0].url);

  const {
    track_name,
    album_name,
    artists,
    artwork,
    progress_ms,
    duration_ms,
  } = placeHolderData;

  const progressPerc = (progress_ms / duration_ms) * 100;

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
            name={track_name}
            album={album_name}
            artists={artists}
            imgSrc={artwork}
            progressPerc={progressPerc}
          />
        </Grid>
        <Grid item>
          <EmojiCard />
        </Grid>
      </Grid>
    </Layout>
  );
}
