import sqlite3

conn = sqlite3.connect("Backend/sql_app.db")
cursor = conn.cursor()

# Rename old table
cursor.execute("ALTER TABLE ratings RENAME TO ratings_old;")

# Create new table with correct column name
cursor.execute("""
CREATE TABLE ratings (
    id INTEGER NOT NULL PRIMARY KEY,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME NOT NULL,
    giver_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL
);
""")

# Copy data
cursor.execute("""
INSERT INTO ratings (id, rating, comment, created_at, giver_id, receiver_id)
SELECT id, rating, comment, created_at, giver_id, reciever_id FROM ratings_old;
""")

# Drop old table
cursor.execute("DROP TABLE ratings_old;")

conn.commit()
conn.close()

