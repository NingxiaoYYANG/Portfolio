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
      # Split comma-separated origins
      origins_list = [origin.strip() for origin in cors_origins.split(',')]
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
