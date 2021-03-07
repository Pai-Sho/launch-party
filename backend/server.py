import os, time, datetime, socket
import requests, json, secrets

import spotipy
from spotipy.oauth2 import SpotifyOAuth, SpotifyClientCredentials

from flask import Flask, render_template, redirect, session, request, url_for, make_response
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_cors import CORS, cross_origin
from db import *
app = Flask(__name__)
app.config['SECRET_KEY']    = secrets.token_urlsafe(16)
app.config['DATABASE']      = 'ratings.db'
#app.config['CORS_HEADERS']  = 'Content-Type'
socketio = SocketIO(app)
socketio.init_app(app, cors_allowed_origins="*")
CORS(app)

# Flask params
FLASK_HOST      = os.getenv('FLASK_HOST', default='192.168.0.2')
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
track_ratings   = {}
track_reactions = {}


@app.after_request
def after_request(response):
    #response.headers.add('Access-Control-Allow-Origin', '*')
    #response.headers.add('Access-Control-Allow-Headers',
    #                     'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    #response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    #response.set_cookie('same-site-cookie', 'foo', samesite='Lax');
    # Ensure you use "add" to not overwrite existing cookie headers
    #response.headers.add('Set-Cookie','cross-site-cookie=bar; SameSite=None;')
    #print(response.headers)
    return response


# Landing page - redirects to spotify oauth
@app.route('/', methods=['GET'])
def home():
    return redirect(url_for('login', username=secrets.token_urlsafe(6)))

# Starts spotify user authentication flow
@app.route('/login', methods=['GET'])
def login():
    if 'Referer' in request.headers:
        session['referer'] = request.headers.get('Referer')
    else:
        session['referer'] = request.headers.get('Host')

    session['user'] = request.args.get('username')
    #session['SameSite'] = None
    #session['Secure'] = False
    sp_oauth = SpotifyOAuth(client_id = CLIENT_ID,
                            client_secret = CLIENT_SECRET,
                            redirect_uri = REDIRECT_URI,
                            scope = SCOPE,
                            username = session['user'])

    auth_url = sp_oauth.get_authorize_url()

    response = make_response(redirect(auth_url))
    response.headers.add('Access-Control-Allow-Origin', session['referer'])

    return response

# Stores user auth tokens for session
@app.route('/auth_callback')
def auth_callback():
    sp_oauth = SpotifyOAuth(client_id = CLIENT_ID,
                            client_secret = CLIENT_SECRET,
                            redirect_uri = REDIRECT_URI,
                            scope = SCOPE,
                            username = session['user'])

    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session['token_info'] = token_info
    session['current_track'] = None
    #session.modified = True

    '''
    sp = spotipy.Spotify(auth=token_info['access_token'])
    user = sp.current_user()
    user_name = user['display_name']
    user_profile_url = user['external_urls']['spotify']

    current_track_info = get_current_track_info()

    session['current_track'] = current_track_info['track_id']
    '''

    #response = make_response(redirect('get_user_current_track'))
    #return ('SUCCESS',200)
    print(session['referer']+'party')
    return redirect(session['referer']+'party')

# Queries Spotify Web API to get user's currently playing track info
# Redirects to track-specific dashboard/chat room
@app.route('/get_user_current_track', methods=['GET'])
def get_user_current_track():
    try:
        payload = get_current_track_info()

    except Exception as e:
        print(e)
        return redirect(url_for('error'))

    if payload['track_id'] != session['current_track']:
        print('Track Changed!')
        #emit('new_track', {'track_id': payload['track_id']})
        session['current_track'] = payload['track_id']

    print('TO BENI: ', json.dumps(payload))
    return json.dumps(payload)

@app.route('/get_track_features', methods=['GET'])
def get_track_features():
    track_id = request.args.get('track_id')
    auth_manager = SpotifyClientCredentials(client_id = CLIENT_ID,
                                            client_secret = CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)

    audio_features = sp.audio_features(track_id)[0]
    return json.dumps(audio_features)

# App dashboard homepage - TODO: implement chat room functionality
@app.route('/dashboard/<track_id>', methods=['GET'])
def dashboard(track_id):
    auth_manager = SpotifyClientCredentials(client_id = CLIENT_ID,
                                            client_secret = CLIENT_SECRET)
    sp = spotipy.Spotify(auth_manager=auth_manager)


    audio_features = sp.audio_features(track_id)[0]

    #return 'Current track info: <br/><br/>\
    #        Track: {} <br/><br/> Artist: {} <br/><br/>\
    #        Audio Features: <br/>{}'.format(track_name, artists, json.dumps(audio_features, indent=2).replace('\n','<br/>'))
    return render_template('chat_test.html')

# Callback for track rate action
@app.route('/rate', methods=['POST','OPTIONS'])
def rating():
    if request.method == 'POST':
        form = json.loads(request.data)
        print(form)
        track_id = form['data']['track_id']
        rating = form['data']['rating']

        insert_ratings(track_id,rating)

        if track_id in track_ratings.keys():
            track_ratings[track_id].append(rating)
        else:
            track_ratings[track_id] = [rating]

        return ('', 201)
    else:
        return ('', 200)

# Callback for track react action
@app.route('/react', methods=['POST','OPTIONS'])
def react():
    if request.method == 'POST':
        form = json.loads(request.data)
        track_id = form['data']['track_id']
        elapsed_ms = form['data']['elapsed_ms']
        enum = form['data']['enum']

        insert_reacts(track_id,elapsed_ms,enum)

        if track_id in track_reactions.keys():
            track_reactions[track_id].append((elapsed_ms, enum))
        else:
            track_reactions[track_id] = [(elapsed_ms, enum)]

        return ('', 201)
    else:
        return ('', 200)

@app.route('/get_ratings', methods=['GET'])
def get_ratings():
    track_id = request.args.get('track_id')
    ratings = query_ratings(track_id)
    return json.dumps({'track_id':track_id,'ratings':ratings})

@app.route('/get_reacts', methods=['GET'])
def get_reacts():
    track_id = request.args.get('track_id')
    reacts = query_reacts(track_id)
    return json.dumps({'track_id':track_id,'reacts':reacts})

# Error Page
@app.route('/error', methods=['GET'])
def error():
    return 'Some kind of error happened idk'

@socketio.on('connect')
def connect():
    print('yeet')
    emit('connected', {'track_id':session['current_track']})

@socketio.on('join')
def on_join():
    username = session['user']
    room = session['current_track']
    join_room(room)
    print(username + ' has entered the chat.')
    send(username + ' has entered the chat.', room=room)

@socketio.on('leave')
def on_leave():
    username = session['user']
    room = session['current_track']
    leave_room(room)
    print(username + ' has left the chat.')
    send(username + ' has left the chat.', room=room)

@socketio.on('send message')
def message(data):
    username = session['user']
    room = session['current_track']
    emit('broadcast message', {'user':username,'data':data['message']}, room=room)

def get_current_track_info():
    sp = spotipy.Spotify(auth=session.get('token_info').get('access_token'))
    response = sp.current_user_playing_track()

    #if response != None:
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

    return payload

if __name__ == '__main__':
    socketio.run(app, debug=True, host=FLASK_HOST, port=FLASK_PORT)
