import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'cyberguard-super-secret-key-1337')
    # Default to sqlite inside the app folder if DATABASE_URL isn't set
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        'sqlite:///' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cyberguard.db')
    )
    # Adjust for postgres:// vs postgresql:// compatibility if needed
    if SQLALCHEMY_DATABASE_URI.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI = SQLALCHEMY_DATABASE_URI.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
