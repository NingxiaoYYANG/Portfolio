from flask import Blueprint, request, jsonify, current_app
from flask_mail import Message, Mail

bp = Blueprint('api', __name__, url_prefix='/api')
mail = Mail()

# Sample projects data (can be moved to database later)
PROJECTS = [
    {
        'id': 1,
        'title': 'CourseMaper (COMP3900)',
        'subtitle': "Bloom's Taxonomy Analytics Platform",
        'category': 'Web',
        'year': '2024',
        'cover': '/CourseMapper/CourseMapper_homepage.png',
        'coverType': 'image',
        'description': "Web app that analyses course outlines and exam questions using Bloom's Taxonomy. Delivered with a 3–6 person team using TDD, CI/CD, and client feedback loops.",
        'techTags': ['React', 'Flask', 'Python', 'BERT'],
        'highlightTags': ['TDD', 'CI/CD', 'Team Lead'],
        'technologies': ['React', 'Flask', 'Python', 'BERT', 'TDD', 'CI/CD'],  # Backward compatibility
        'codeUrl': 'https://github.com/NingxiaoYYANG/COMP3900_course_outline_mapping',
        'demoUrl': '',
        'caseStudyUrl': '/CourseMapper/Final Report.pdf',
        'screenshots': [
            '/CourseMapper/CourseMapper_Outlines.png',
            '/CourseMapper/CourseMapper_Outcome.png',
        ],
        'github_url': 'https://github.com/NingxiaoYYANG/COMP3900_course_outline_mapping',  # Backward compatibility
        'demo_url': '',  # Backward compatibility
        'image': '',  # Backward compatibility
        'featured': True
    },
    {
        'id': 2,
        'title': 'SkillVerse (Web3 & AI Hackathon)',
        'subtitle': 'Decentralised Certification Platform',
        'category': 'Hackathon',
        'year': '2023',
        'cover': '/SkillVerse/award.jpg',
        'coverType': 'image',
        'description': 'AI-powered decentralised certification platform with NFT credentials. Built and demoed under tight deadline, awarded Aspiring Entrepreneur and Best Presentation.',
        'techTags': ['React', 'Solidity', 'IPFS', 'OpenAI API'],
        'highlightTags': ['Web3', 'NFT', 'Hackathon Winner'],
        'technologies': ['React', 'Solidity', 'IPFS', 'OpenAI API', 'Web3'],  # Backward compatibility
        'codeUrl': 'https://github.com/NingxiaoYYANG/Skillverse',
        'demoUrl': '',
        'caseStudyUrl': '/SkillVerse/SkillVerse Demo Video.mp4',
        'screenshots': [
            '/SkillVerse/TitlePage.png',
            '/SkillVerse/Selection.png',
            '/SkillVerse/SkillTree.png',
            '/SkillVerse/CollectNFT.png',
            '/SkillVerse/CompleteAll.png',
            '/SkillVerse/Loading.png',
        ],
        'github_url': 'https://github.com/NingxiaoYYANG/Skillverse',  # Backward compatibility
        'demo_url': '',  # Backward compatibility
        'image': '',  # Backward compatibility
        'featured': True
    },
    {
        'id': 3,
        'title': 'MistWalker (NetEase KK GameDev Contest)',
        'subtitle': 'Cooperative Survival Game',
        'category': 'Game',
        'year': '2024',
        'cover': '/MistWalker/mistwalker.jpg',
        'coverType': 'image',
        'description': 'Top-down cooperative survival game built in Y3 Editor. Implemented core systems including movement, damage, UI, buffs, and item/unit mechanics under contest constraints.',
        'techTags': ['Y3 Editor', 'GameDev'],
        'highlightTags': ['Gameplay Systems', 'UI Systems'],
        'technologies': ['GameDev', 'Y3 Editor', 'UI', 'Gameplay Systems'],  # Backward compatibility
        'codeUrl': 'https://github.com/NingxiaoYYANG/MistWalker.git',
        'demoUrl': '',
        'caseStudyUrl': '/MistWalker/mistwalker.mp4',
        'screenshots': [
            '/MistWalker/ingame.png',
            '/MistWalker/Awards.jpg',
        ],
        'github_url': 'https://github.com/NingxiaoYYANG/MistWalker.git',  # Backward compatibility
        'demo_url': '',  # Backward compatibility
        'image': '',  # Backward compatibility
        'featured': True
    },
    {
        'id': 4,
        'title': 'Event Management Platform (Contract)',
        'subtitle': 'ACSA Event Platform',
        'category': 'Web',
        'year': '2023-2024',
        'cover': '/AACSI/TitlePage.png',
        'coverType': 'image',
        'description': 'React + Flask + SQL platform with authentication and admin/user workflows. Deployed on GoDaddy hosting and supported stability during production handover.',
        'techTags': ['React', 'Flask', 'SQL'],
        'highlightTags': ['Auth Systems', 'Production Deployment'],
        'technologies': ['React', 'Flask', 'SQL', 'Auth', 'GoDaddy Hosting'],  # Backward compatibility
        'codeUrl': 'https://github.com/NingxiaoYYANG/AACSI_Project',
        'demoUrl': 'https://aacsi.org.au/',
        'caseStudyUrl': '',
        'screenshots': [
            '/AACSI/EventsPage.png',
            '/AACSI/ProfilePage.png',
            '/AACSI/SignUpPage.png',
        ],
        'github_url': 'https://github.com/NingxiaoYYANG/AACSI_Project',  # Backward compatibility
        'demo_url': 'https://aacsi.org.au/',  # Backward compatibility
        'image': '',  # Backward compatibility
        'featured': True
    },
    {
        'id': 5,
        'title': 'Production Website (Contract)',
        'subtitle': 'Jo-en Media Website',
        'category': 'Web',
        'year': '2024',
        'cover': '/JoEnMedia/HomePage.png',
        'coverType': 'image',
        'description': 'Production website built with React + Flask and containerised with Docker. Delivered enquiry-to-email workflow and deployed to production with client handover.',
        'techTags': ['React', 'Flask', 'Docker'],
        'highlightTags': ['Docker', 'Production Deployment'],
        'technologies': ['React', 'Flask', 'Docker', 'Deployment', 'REST APIs'],  # Backward compatibility
        'codeUrl': 'https://github.com/NingxiaoYYANG/Jo-enmedia',
        'demoUrl': 'https://jo-enmedia.com',
        'caseStudyUrl': '/JoEnMedia/joen_demo.mp4',
        'screenshots': [
            '/JoEnMedia/ContactUsPage.png',
            '/JoEnMedia/WorkPage.png',
        ],
        'github_url': 'https://github.com/NingxiaoYYANG/Jo-enmedia',  # Backward compatibility
        'demo_url': 'https://jo-enmedia.com',  # Backward compatibility
        'image': '',  # Backward compatibility
        'featured': True
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
