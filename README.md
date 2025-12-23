```md
# Bug Tracking System (MERN)

A simple, minimal bug tracking system built using the MERN stack.  

---

## What this project does

- Users can register and log in
- Create projects
- Report bugs inside a project
- Assign bugs to users
- Change bug status (Open → In Progress → Resolved → Closed)
- Comment on bugs (for updates and discussion)


---

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT

---

## Folder Structure

```

bug-tracker-mern/
│
├── server/
│   ├── src/
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & role checks
│   │   └── app.js         # Express app config
│   ├── server.js          # App entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── pages/         # Screens (Login, Dashboard, Bugs)
│   │   ├── components/    # Reusable UI components
│   │   └── App.jsx
│   └── package.json
│
└── README.md

```

---

## User Roles

### User
- Create bugs
- View bugs in projects
- Comment on bugs
- Update status of bugs assigned to them

### Admin
- Everything a user can do
- Create projects
- Assign bugs to users

---

## Core Data Models

### User
- name
- email
- password (hashed)
- role (user / admin)

### Project
- name
- description
- createdBy

### Bug
- title
- description
- status (Open, In Progress, Resolved, Closed)
- priority (Low, Medium, High)
- projectId
- createdBy
- assignedTo

### Comment
- bugId
- text
- userId

---

## API Responsibilities

### Auth
- Register
- Login
- JWT middleware

### Project
- Create project (admin)
- Get all projects

### Bug
- Create bug
- Update bug
- Change status
- Assign user
- Filter by status / priority

### Comment
- Add comment to bug
- View comments for a bug

---

## How to run locally

### Backend
```

cd server
npm install
npm run dev

```

Create `.env` in `server/`:
```

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=any_secret

```

### Frontend
```

cd client
npm install
npm run dev

```

---

## Notes

Bug tracking is done using:
- text description
- status
- assignment
- comments  

---
```
