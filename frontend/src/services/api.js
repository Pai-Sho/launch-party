import axios from "axios";

const fetcher = (url) =>
  fetch(url, {
    method: "GET",
  }).then((r) => r.json());

const postTrackRating = async (rating) => {
  try {
    const res = await axios.post("/replace/with", rating);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const postAlbumRating = async (rating) => {
  try {
    const res = await axios.post("/replace/with", rating);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

const postReaction = async (text) => {
  try {
    const res = await axios.post("/replace/with", text);
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

export { fetcher, postTrackRating, postAlbumRating, postReaction };
