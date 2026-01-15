# Portfolio Website

A modern, creative portfolio website built with React and Flask, featuring stunning animations, 3D effects, and a full-stack architecture.

## Features

- 🎨 **Creative Design**: Modern UI with animations, 3D effects, and particle backgrounds
- 🚀 **Full Stack**: React frontend with Flask backend API
- 📱 **Responsive**: Fully responsive design for all devices
- ⚡ **Performance**: Code splitting, lazy loading, and optimized animations
- 🎯 **Interactive**: Smooth page transitions, scroll animations, and hover effects

## Tech Stack

### Frontend
- React 19
- React Router
- Framer Motion (animations)
- Three.js / React Three Fiber (3D effects)
- GSAP (advanced animations)
- Tailwind CSS
- Axios

### Backend
- Flask
- Flask-CORS
- Flask-Mail

## Project Structure

```
portfolio/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Style files
│   └── package.json
├── backend/           # Flask backend API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── routes.py      # API routes
│   │   └── config.py      # Configuration
│   └── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```env
SECRET_KEY=your-secret-key-here
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_DEFAULT_SENDER=your-email@gmail.com
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

5. Run the Flask server:
```bash
python run.py
```

The backend API will be available at `http://localhost:5000`

## Deployment

### Frontend (Vercel)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy to Vercel:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL=your-backend-url/api`

### Backend (Railway / Render)

1. Create a new project on Railway or Render
2. Connect your GitHub repository
3. Set the root directory to `backend`
4. Add environment variables from `.env`
5. Deploy!

## Customization

### Update Personal Information

1. Edit `frontend/src/pages/Home.jsx` - Update name and introduction
2. Edit `frontend/src/pages/About.jsx` - Update about section
3. Edit `frontend/src/components/SkillTree.jsx` - Update skills
4. Edit `frontend/src/components/Timeline.jsx` - Update timeline data
5. Edit `frontend/src/pages/Experience.jsx` - Update experience data

### Update Projects

Edit `backend/app/routes.py` - Update the `PROJECTS` array with your projects.

## License

MIT License - feel free to use this project for your own portfolio!

## Credits

Built with inspiration from:
- [Brittany Chiang](https://brittanychiang.com/)
- [Josh Comeau](https://www.joshwcomeau.com/)
- [Robby Leonardi](http://www.rleonardi.com/interactive-resume/)
