import sqlite3

connectionObject = sqlite3.connect("ratings.db")
cursorObject     = connectionObject.cursor()

createTable = "CREATE TABLE track_ratings(track_id text, rating int)"
cursorObject.execute(createTable)

createTable = "CREATE TABLE track_reacts(track_id text, elapsed_ms int, react int)"
cursorObject.execute(createTable)

connectionObject.close()
