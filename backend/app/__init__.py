from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    # Allow all origins in development, or specific origins from config in production
    cors_origins = app.config.get('CORS_ORIGINS', '*')
    if cors_origins == '*' or not cors_origins:
      CORS(app, resources={r"/api/*": {"origins": "*"}})
    else:
      # CORS_ORIGINS is already a list from config.py (split by comma)
      # Handle both string and list cases
      if isinstance(cors_origins, str):
        origins_list = [origin.strip() for origin in cors_origins.split(',')]
      else:
        # Already a list
        origins_list = [origin.strip() if isinstance(origin, str) else origin for origin in cors_origins]
      CORS(app, resources={r"/api/*": {"origins": origins_list}})
    
    # Initialize Mail
    mail = Mail(app)
    # Make mail available to routes
    from app import routes
    routes.mail = mail
    
    # Register blueprints
    from app.routes import bp
    app.register_blueprint(bp)
    
    return app
