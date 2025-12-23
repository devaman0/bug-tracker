# Bug Tracking System (MERN)

A simple bug tracking system built with the MERN stack.
This README is self-sufficient — anyone can start working without asking for clarification.

---

## Purpose

Track bugs using structured text, ownership, and status flow.

---

## Features

* User authentication (JWT)
* Create and manage projects
* Report bugs inside projects
* Assign bugs to users
* Update bug status: Open → In Progress → Resolved → Closed
* Comment on bugs for discussion and history

No file uploads. No notifications. Text-based tracking only.

---

## Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: MongoDB (Mongoose)
* Authentication: JWT

---

## Folder Structure

```
bug-tracker-mern/
├── server/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## Roles

### User

* Create bugs
* View bugs in projects
* Comment on bugs
* Update status of assigned bugs

### Admin

* All user permissions
* Create projects
* Assign bugs

---

## Data Models

### User

* name
* email
* password (hashed)
* role (user / admin)

### Project

* name
* description
* createdBy

### Bug

* title
* description
* status (Open, In Progress, Resolved, Closed)
* priority (Low, Medium, High)
* projectId
* createdBy
* assignedTo

### Comment

* bugId
* text
* userId

---

## API Responsibility Split

### Auth

* Register
* Login
* JWT auth middleware

### Project

* Create project (admin only)
* Get all projects

### Bug

* Create bug
* Update bug
* Change status
* Assign user
* Filter by status / priority

### Comment

* Add comment to bug
* Get comments by bug

---

## Local Setup

### Backend

```
cd server
npm install
npm run dev
```

Create `server/.env`

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

### Frontend

```
cd client
npm install
npm run dev
```

---

## Contribution Rules

* Keep scope minimal
* No extra features
* Commit small and often
* Follow CRUD patterns
* Don’t block teammates

---

## Status

Initial setup complete.
Next milestone: authentication + schemas.

---

## Design Note

Bug tracking is implemented via:

* structured text
* status changes
* assignment
* comments

File uploads are intentionally excluded.
