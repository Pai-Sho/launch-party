import axios from "axios";

const BASE_URL = "http://192.168.0.2:5000";

async function login(endpoint) {
  try {
    const res = await axios.get(`${BASE_URL}/`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

async function fetcher(endpoint) {
  try {
    const res = await axios.get(`${BASE_URL}/${endpoint}`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    console.error(err);
  }
}

const postTrackRating = async (track_id, rating) => {
  try {
    console.log(rating);
    const res = await axios.post(`${BASE_URL}/rate`, {
      data: {
        track_id,
        rating,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
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

const postReaction = async (trackID, elapsed_ms, val) => {
  try {
    const res = await axios.post(`${BASE_URL}/react`, {
      data: {
        track_id: trackID,
        elapsed_ms,
        enum: val,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res.data);
  } catch (err) {
    console.error(err);
  }
};

export { fetcher, postTrackRating, postAlbumRating, postReaction, login };
