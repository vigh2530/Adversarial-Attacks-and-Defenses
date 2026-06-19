import os
from flask import Flask
from flask_cors import CORS
from .config import Config
from .models.db_models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Configure CORS - allow React app to access the backend API
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize Database
    db.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.detection import detection_bp
    from .routes.dashboard import dashboard_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(detection_bp, url_prefix='/api/detect')
    app.register_blueprint(dashboard_bp, url_prefix='/api')
    
    # Create tables
    with app.app_context():
        db.create_all()
        print("Database tables verified/created successfully.")
        
    return app
