# Bug Tracker

A simple, efficient bug tracking system built with Node.js, Express, SQLite, and EJS.

## Features

### User Roles
- **User**: Can view projects, create/edit/delete bugs and comments
- **Admin**: All User permissions plus create/edit/delete projects

### Core Entities
- **Projects**: Containers for organizing bugs
- **Bugs**: Issues with status (Open, In Progress, Resolved, Closed) and priority (Low, Medium, High)
- **Comments**: Discussions on bug details

### What's NOT Included (By Design)
- ❌ No email notifications
- ❌ No file uploads
- ❌ No complex role hierarchies
- ❌ No analytics or dashboard charts
- ❌ No real-time updates

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/devaman0/bug-tracker.git
cd bug-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### First Time Setup

1. **Register an Account**
   - Visit http://localhost:3000/register
   - Choose username and password
   - Select role: User or Admin
   - For full functionality, create at least one Admin account

2. **Login**
   - Use your credentials at http://localhost:3000/login

### Creating Projects (Admin Only)

1. Navigate to the Projects page
2. Click "New Project"
3. Enter project name and description
4. Click "Create Project"

### Managing Bugs

1. Open a project
2. Click "New Bug"
3. Fill in:
   - Title (required)
   - Description
   - Status: Open, In Progress, Resolved, Closed
   - Priority: Low, Medium, High
   - Assign to a user (optional)
4. Click "Create Bug"

### Adding Comments

1. Open any bug detail page
2. Scroll to the Comments section
3. Type your comment
4. Click "Post Comment"

## Project Structure

```
bug-tracker/
├── src/
│   ├── models/         # Database models (User, Project, Bug, Comment)
│   ├── routes/         # Express route handlers
│   ├── middleware/     # Authentication & authorization middleware
│   ├── views/          # EJS templates
│   ├── database.js     # SQLite database setup
│   └── app.js          # Main application file
├── bugtracker.db       # SQLite database (created on first run)
├── package.json
└── README.md
```

## Database Schema

### Users
- id, username, password (hashed), role (User/Admin), created_at

### Projects
- id, name, description, created_by, created_at

### Bugs
- id, title, description, project_id, status, priority, created_by, assigned_to, created_at, updated_at

### Comments
- id, content, bug_id, created_by, created_at

## Security

- Passwords are hashed using bcryptjs
- Session-based authentication
- Role-based authorization middleware
- SQL injection protection via parameterized queries

## Technologies

- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Templating**: EJS
- **Authentication**: bcryptjs, express-session
- **Styling**: Inline CSS (no external dependencies)

## License

ISC