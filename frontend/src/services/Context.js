import React from "react";

const TrackContext = React.createContext();

const placeHolderData = {
  track_id: "5JAYDuLRkODlVt6dgoalKk",
  track_name: "Tell Me U Luv Me (with Trippie Redd)",
  album_name: "Legends Never Die",
  artists: ["Juice WRLD", "Trippie Redd"],
  artwork: "https://i.scdn.co/image/ab67616d0000b2733e0698e4ae5ffb82a005aeeb",
  progress_ms: 110370,
  duration_ms: 180129,
};

export { TrackContext, placeHolderData };
