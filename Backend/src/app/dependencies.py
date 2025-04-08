from app.core.database import SessionLocal
#From Professors dependencies file 


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()