from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message, Mail

bp = Blueprint('api', __name__, url_prefix='/api')
mail = Mail()

# Sample projects data (can be moved to database later)
PROJECTS = [
    {
        'id': 1,
        'title': 'CourseMaper (COMP3900)',
        'description': 'Web app that analyses course outlines and exam questions using Bloom’s Taxonomy; includes visual analytics. Built for UNSW with a 3–6 person team.',
        'technologies': ['React', 'Flask', 'Python', 'BERT', 'TDD', 'CI/CD'],
        'github_url': '',
        'demo_url': '',
        'image': ''
    },
    {
        'id': 2,
        'title': 'SkillVerse (Web3 & AI Hackathon)',
        'description': 'AI-powered decentralised certification platform. Issued NFT credentials via IPFS and generated a Skill Tree diagram from user input using OpenAI API.',
        'technologies': ['React', 'Solidity', 'IPFS', 'OpenAI API', 'Web3'],
        'github_url': '',
        'demo_url': '',
        'image': ''
    },
    {
        'id': 3,
        'title': 'MistWalker (NetEase KK GameDev Contest)',
        'description': 'Top-down cooperative survival game built in Y3 Editor. Implemented movement, damage, UI (static & dynamic), buffs, and item/unit mechanics under contest constraints.',
        'technologies': ['GameDev', 'Y3 Editor', 'UI', 'Gameplay Systems'],
        'github_url': '',
        'demo_url': '',
        'image': ''
    },
    {
        'id': 4,
        'title': 'Event Management Platform (Contract)',
        'description': 'React + Flask + SQL platform with authentication, profiles, and admin/user event workflows; deployed on GoDaddy hosting and supported handover.',
        'technologies': ['React', 'Flask', 'SQL', 'Auth', 'GoDaddy Hosting'],
        'github_url': '',
        'demo_url': '',
        'image': ''
    },
    {
        'id': 5,
        'title': 'Production Website (Contract)',
        'description': 'Production website built with React + Flask; backend containerised with Docker and deployed; enquiry-to-email backend workflow.',
        'technologies': ['React', 'Flask', 'Docker', 'Deployment', 'REST APIs'],
        'github_url': '',
        'demo_url': '',
        'image': ''
    }
]

@bp.route('/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    return jsonify({
        'success': True,
        'data': PROJECTS
    })

@bp.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get a single project by ID"""
    project = next((p for p in PROJECTS if p['id'] == project_id), None)
    if project:
        return jsonify({
            'success': True,
            'data': project
        })
    return jsonify({
        'success': False,
        'message': 'Project not found'
    }), 404

@bp.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submission"""
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'email', 'message']
    for field in required_fields:
        if not data.get(field):
            return jsonify({
                'success': False,
                'message': f'{field} is required'
            }), 400
    
    # Send email if mail is configured
    if current_app.config.get('MAIL_USERNAME'):
        try:
            msg = Message(
                subject=f"Portfolio Contact: {data['name']}",
                recipients=[current_app.config['MAIL_DEFAULT_SENDER']],
                body=f"Name: {data['name']}\nEmail: {data['email']}\nMessage: {data['message']}",
                reply_to=data['email']
            )
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {e}")
            # Still return success to user, but log the error
    
    return jsonify({
        'success': True,
        'message': 'Thank you for your message! I will get back to you soon.'
    })

@bp.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'message': 'API is running'
    })
