# MERN Stack Grievance Management System

This project converts the Python Flask-based grievance system to MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
grievance-mern/
├── backend/           # Express.js API server
│   ├── routes/       # API routes (grievances, auth, admin, analytics)
│   ├── models/       # Mongoose schemas (Grievance, User)
│   ├── controllers/  # Business logic
│   ├── middleware/   # Custom middleware
│   ├── server.js     # Express server entry point
│   ├── package.json  # Backend dependencies
│   └── .env          # Environment variables
│
└── frontend/         # React.js application
    ├── src/
    │   ├── pages/        # Page components
    │   ├── components/   # Reusable components
    │   ├── styles/       # CSS files
    │   ├── App.js        # Main app router
    │   └── index.js      # React entry point
    ├── public/           # Static files
    ├── package.json      # Frontend dependencies
    └── .env              # React environment variables
```

## Features

### Backend (Express.js)
- REST API with Express
- MongoDB database integration with Mongoose
- User authentication (Registration/Login) with JWT
- Grievance CRUD operations
- Admin dashboard endpoints- Priority / escalation support (fields, endpoints)- Analytics and reporting endpoints
- Integration with Python AI service for classification

### Frontend (React.js)
- Responsive SPA using React Router
- Pages:
  - Home
  - Submit Grievance
  - Track Grievance
  - Citizen Login/Register
  - Admin Login
  - Admin Dashboard & Panel
  - Analytics
  - Reports
  - Transparency Dashboard
- Form handling with validation
- Error & success notifications
- Protected routes

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (running on localhost:27017)
- Python (3.8+) & Flask (for AI/location stub) or your own AI service
- Python AI Service (optional, for AI classification)

### Installation

1. **Backend Setup:**
```bash
cd grievance-mern/backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`

2. **Frontend Setup:**
```bash
cd grievance-mern/frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

### Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievance_system
JWT_SECRET=your-secret-key
NODE_ENV=development
AI_SERVICE_URL=http://localhost:5001
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Grievances
- `POST /api/grievances` - Create new grievance (includes priority & location)
- `GET /api/grievances` - Get all grievances (with filters)
- `GET /api/grievances/:id` - Get grievance by ID
- `PUT /api/grievances/:id/status` - Update grievance status
- `PUT /api/grievances/:id/priority` - Update priority
- `POST /api/grievances/:id/escalate` - Escalate grievance (level/to/reason)
- `GET /api/grievances/:id/track` - Track grievance
- `POST /api/grievances/:id/comments` - Add comment

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/by-department` - Stats by department
- `GET /api/admin/escalations` - Get escalations

### Analytics
- `GET /api/analytics/statistics` - Get statistics
- `GET /api/analytics/hotspots` - Get problem hotspots
- `GET /api/analytics/performance` - Get performance metrics

## Next Steps

1. Implement remaining page components (Admin Dashboard, Analytics, Reports, Transparency)
2. Add more detailed styling with CSS modules or Tailwind CSS
3. Implement role-based access control (RBAC) middleware
4. Add file upload for attachments
5. Integrate email notifications for grievance updates
6. Deploy to production (Heroku, AWS, etc.)

## Migration Notes

This MERN version replaces the Flask backend and Jinja2 templates with:
- **Express.js** instead of Flask
- **React** instead of Jinja2 templates
- **Mongoose** for MongoDB ORM
- **JWT** for authentication instead of Flask sessions
A lightweight Python stub (`backend/ai_service_stub.py`) can run alongside the backend to return classification and location data for demonstration purposes.The Python AI service can still be used separately by calling the `/classify` endpoint from the Express controller.
