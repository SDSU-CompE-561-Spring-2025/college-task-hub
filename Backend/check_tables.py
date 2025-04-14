import sqlite3
import os

db_path = "Backend/sql_app.db"

if not os.path.exists(db_path):
    print(f"❌ Database file not found at: {db_path}")
    exit()

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

if not tables:
    print("⚠️ No tables found in the database.")
else:
    print("📋 Tables in the DB:")
    for t in tables:
        print(f" - {t[0]}")

conn.close()
