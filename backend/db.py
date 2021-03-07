import sqlite3

from flask import current_app
from flask import g


def get_db():
    """Connect to the application's configured database. The connection
    is unique for each request and will be reused if this is called
    again.
    """
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"], detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db

def query_ratings(track_id):
    con = sqlite3.connect('ratings.db')
    #con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute("SELECT rating FROM track_ratings WHERE track_id = ?",[track_id])
    rows = cur.fetchall();
    return [row[0] for row in rows]

def query_reacts(track_id):
    con = sqlite3.connect('ratings.db')
    #con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute("SELECT * FROM track_reacts WHERE track_id = ?",[track_id])
    rows = cur.fetchall();
    return [(row[1],row[2]) for row in rows]

def insert_ratings(track_id, rating):
    with sqlite3.connect('ratings.db') as con:
        cur = con.cursor()
        cur.execute("INSERT INTO track_ratings (track_id,rating) VALUES (?,?)",(track_id,rating))
        con.commit()

def insert_reacts(track_id, elapsed_ms, react_enum):
    with sqlite3.connect('ratings.db') as con:
        cur = con.cursor()
        cur.execute("INSERT INTO track_reacts (track_id,elapsed_ms,react) VALUES (?,?,?)",(track_id,elapsed_ms,react_enum))
        con.commit()

def close_db(e=None):
    """If this request connected to the database, close the
    connection.
    """
    db = g.pop("db", None)

    if db is not None:
        db.close()
