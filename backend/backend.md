# Auth flow

### Step 1:
Send `GET` request to `/login` endpoint with a `username` parameter defined (Grab this from a form on the landing page)
Example: `{BASE_URL}/login?username=Pai-Sho`

### Step 2:
User will be redirected to spotify login page

### Step 3:
Automatically redirects to `/get_current_user_track` endpoint

# Endpoints

## `/get_user_current_track`
- method: `GET`
- params: None
- returns:
```
{
  "track_id": "3YnwIp2b99p3e5dsFTXIIx",
  "track_name": "Dunno",
  "album_name": "Swimming",
  "artists": [
    "Mac Miller"
  ],
  "artwork": "https://i.scdn.co/image/ab67616d0000b273175c577a61aa13d4fb4b6534",
  "progress_ms": 109492,
  "duration_ms": 237093
}
```

## `/get_track_features`
- method: `GET`
- params: `track_id`
- returns:
```
{
  "danceability": 0.622,
  "energy": 0.229,
  "key": 1,
  "loudness": -11.322,
  "mode": 1,
  "speechiness": 0.0445,
  "acousticness": 0.768,
  "instrumentalness": 0.00906,
  "liveness": 0.134,
  "valence": 0.0998,
  "tempo": 81.87,
  "type": "audio_features",
  "id": "3YnwIp2b99p3e5dsFTXIIx",
  "uri": "spotify:track:3YnwIp2b99p3e5dsFTXIIx",
  "track_href": "https://api.spotify.com/v1/tracks/3YnwIp2b99p3e5dsFTXIIx",
  "analysis_url": "https://api.spotify.com/v1/audio-analysis/3YnwIp2b99p3e5dsFTXIIx",
  "duration_ms": 237093,
  "time_signature": 4
}
```

## `/rate`
- method: `POST`
- params: `track_id`, `rating`
- returns: None

## `/react`
- method: `POST`
- params: `track_id`, `elapsed_ms`, `enum`
- returns: None

## `/get_ratings`
- method: `GET`
- params: `track_id`
- returns:
```
{
'track_id': '19m3E0nMZobyA93AxMXC32', 
'ratings': [5, 5, 5, 5, 5, 5, 5, 5]
}
```

## `/get_reacts`
- method: `GET`
- params: `track_id`
- returns:
```
{
'track_id': '19m3E0nMZobyA93AxMXC32', 
'reacts': [[23454, 3], [21454, 2]]
}
```
