# Portfolio Website

A modern portfolio website built with React (Frontend) and Flask (Backend).

## Features

- Responsive design with modern UI
- Project showcase with image carousel
- Contact form
- Recruiter Mode / Play Mode dual-path experience
- Mini game integration

## Tech Stack

### Frontend
- React 19
- Vite 7
- Tailwind CSS 3
- Framer Motion
- Three.js / React Three Fiber
- Phaser (for mini game)

### Backend
- Flask
- Python 3.12

## Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed
- npm or yarn

### Development Mode

#### Windows
```bash
start-dev.bat
```

#### Linux/Mac
```bash
./start-dev.sh
```

This will:
1. Set up Python virtual environment (if needed)
2. Install backend dependencies
3. Install frontend dependencies (if needed)
4. Start backend server on http://localhost:5000
5. Start frontend server on http://localhost:5173

Both servers will run in separate windows/processes. Close them individually to stop.

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Docker Deployment

### Build and Run
```bash
docker-compose up --build
```

### Stop
```bash
docker-compose down
```

## Project Structure

```
Portfolio/
├── backend/          # Flask API server
│   ├── app/         # Application code
│   ├── run.py       # Entry point
│   └── requirements.txt
├── frontend/         # React application
│   ├── src/         # Source code
│   ├── public/      # Static assets
│   └── package.json
├── docker-compose.yml
├── start-dev.bat    # Windows dev launcher
└── start-dev.sh     # Linux/Mac dev launcher
```

## Environment Variables

### Frontend
- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:5000/api)

### Backend

Create a `.env` file in the `backend/` directory with the following variables:

#### Required for Email Functionality
```env
# Mail Configuration
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password-here
MAIL_DEFAULT_SENDER=your-email@gmail.com
```

**Setting up Gmail for sending emails:**

1. Enable 2-Step Verification on your Google Account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable "2-Step Verification"

2. Generate an App Password:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this password (not your regular Gmail password) for `MAIL_PASSWORD`

3. Use your Gmail address for both `MAIL_USERNAME` and `MAIL_DEFAULT_SENDER`

**For other email providers:**
- **Outlook/Hotmail**: `MAIL_SERVER=smtp-mail.outlook.com`, `MAIL_PORT=587`
- **Yahoo**: `MAIL_SERVER=smtp.mail.yahoo.com`, `MAIL_PORT=587`
- **Custom SMTP**: Use your provider's SMTP settings

#### Optional
- `SECRET_KEY` - Flask secret key (default: auto-generated dev key)
- `CORS_ORIGINS` - Comma-separated list of allowed origins (default: *)
- `FLASK_ENV` - Flask environment (development/production)
- `FLASK_DEBUG` - Enable debug mode (true/false)

## License

MIT
