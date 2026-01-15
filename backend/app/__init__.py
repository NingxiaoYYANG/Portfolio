from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from app.config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize Mail
    mail = Mail(app)
    # Make mail available to routes
    from app import routes
    routes.mail = mail
    
    # Register blueprints
    from app.routes import bp
    app.register_blueprint(bp)
    
    return app
