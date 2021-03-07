import os, time, datetime
import requests, json, secrets

import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

from flask import Flask, render_template, redirect, session, request, url_for, make_response
from flask_socketio import SocketIO, emit
app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_urlsafe(16)
socketio = SocketIO(app)

# Flask params
FLASK_HOST      = os.getenv('FLASK_HOST', default='127.0.0.1')
FLASK_PORT      = os.getenv('FLASK_PORT', default='5000')

# Spotify client auth params
CLIENT_ID       = os.getenv('SPOTIFY_CLIENT_ID')
CLIENT_SECRET   = os.getenv('SPOTIFY_CLIENT_SECRET')

# Spotify user auth params
AUTH_BASE       = 'https://accounts.spotify.com/'
REDIRECT_URI    = 'http://{}:{}/auth_callback'.format(FLASK_HOST, FLASK_PORT)
SCOPE           = 'user-read-playback-state'

# Spotify web api params
API_BASE        = 'https://api.spotify.com/v1/'

# In-memory databases for track and album ratings TODO: implemnent SQL db
track_ratings = {}
track_reactions = {}

# Landing page - redirects to spotify oauth
@app.route('/', methods=['GET'])
def home():
    return redirect('login')

# Starts spotify user authentication flow
@app.route('/login')
def login():
    sp_oauth = SpotifyOAuth(client_id = CLIENT_ID,
                            client_secret = CLIENT_SECRET,
                            redirect_uri = REDIRECT_URI,
                            scope = SCOPE)

    auth_url = sp_oauth.get_authorize_url()

    return redirect(auth_url)

# Stores user authentication info for session
@app.route('/auth_callback')
def auth_callback():
    sp_oauth = SpotifyOAuth(client_id = CLIENT_ID,
                            client_secret = CLIENT_SECRET,
                            redirect_uri = REDIRECT_URI,
                            scope = SCOPE)

    session.clear()
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info

    sp = spotipy.Spotify(auth=token_info['access_token'])
    user = sp.current_user()
    user_name = user['display_name']
    user_profile_url = user['external_urls']['spotify']

    response = make_response(redirect('get_current_track_info'))
    response.set_cookie('user_name',user_name)
    response.set_cookie('user_profile_url',user_profile_url)

    return response

@socketio.on('track refresh')
def test_message(message):
    emit('my response', {'data': message['data']})

# Queries Spotify Web API to get user's currently playing track info
# Redirects to track-specific dashboard/chat room
@app.route('/get_current_track_info', methods=['GET','POST'])
def get_current_track_info():
    session['token_info'], authorized = get_token(session)
    session.modified = True

    if not authorized:
        return redirect('login')

    sp = spotipy.Spotify(auth=session.get('token_info').get('access_token'))

    try:
        response = sp.current_user_playing_track()
        # TODO: check if playing track (vs podcast, movie, etc)
        track_id = response['item']['id']
        track_name = response['item']['name']
        album_name = response['item']['album']['name']
        artists = [artist['name'] for artist in response['item']['artists']]
        artwork = response['item']['album']['images'][0]['url']
        progress_ms = response['progress_ms']
        duration_ms = response['item']['duration_ms']
        payload = {'track_id': track_id,
                   'track_name': track_name,
                   'album_name': album_name,
                   'artists': artists,
                   'artwork': artwork,
                   'progress_ms': progress_ms,
                   'duration_ms': duration_ms}
    except TypeError as e:
        return redirect(url_for('error'))

    response = make_response(redirect(url_for('dashboard', track_id=track_id)))
    response.headers.update(payload)

    return response

# App dashboard homepage - TODO: implement chat room functionality
@app.route('/dashboard/<track_id>', methods=['GET'])
def dashboard(track_id):
    auth_manager = SpotifyClientCredentials(client_id = CLIENT_ID,
                                            client_secret = CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)

    track = sp.track(track_id)
    track_name = track['name']
    artists = ', '.join([artist['name'] for artist in track['artists']])

    audio_features = sp.audio_features(track_id)[0]

    return 'Current track info: <br/><br/>\
            Track: {} <br/><br/> Artist: {} <br/><br/>\
            Audio Features: <br/>{}'.format(track_name, artists, json.dumps(audio_features, indent=2).replace('\n','<br/>'))

@app.route('/rate', methods=['POST'])
def rating():
    track_id = request.form['track_id']
    rating = request.form['rating']

    if track_id in track_ratings.keys():
        track_ratings[track_id].append(rating)
    else:
        track_ratings[track_id] = [rating]

@app.route('/react', methods=['POST'])
def react():
    track_id = request.form['track_id']
    elapsed_ms = request.form['elapsed_ms']
    enum = request.form['enum']

    if track_id in track_reactions.keys():
        track_reactions[track_id].append((elapsed_ms, enum))
    else:
        track_reactions[track_id] = [(elapsed_ms, enum)]

# Error Page
@app.route('/error')
def error():
    return 'Error: No tracks currently playing'

# Checks to see if token is valid and gets a new token if not
def get_token(session):
    token_valid = False
    token_info = session.get('token_info', {})

    # Checking if the session already has a token stored
    if not (session.get('token_info', False)):
        token_valid = False
        return token_info, token_valid

    # Checking if token has expired
    now = int(time.time())
    token_expired = session.get('token_info').get('expires_at') - now < 60

    # Refreshing token if it has expired
    if token_expired:
        sp_oauth = spotipy.oauth2.SpotifyOAuth(client_id = CLI_ID, client_secret = CLI_SEC, redirect_uri = REDIRECT_URI, scope = SCOPE)
        token_info = sp_oauth.refresh_access_token(session.get('token_info').get('refresh_token'))

    token_valid = True
    return token_info, token_valid

if __name__ == '__main__':
    socketio.run(app, debug=True, host=FLASK_HOST, port=FLASK_PORT)
