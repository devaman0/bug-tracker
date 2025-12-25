# Bug Tracking System (MERN)

A simple bug tracking system built with the MERN stack.

The project focuses on backend fundamentals: authentication, authorization, role handling, ownership checks, and clean APIs.

---

## Project Overview

The system is used to track bugs inside projects using text, status flow, assignments, and comments.

Users work inside projects, report bugs, update progress, and discuss issues through comments. Access to data is controlled strictly through roles and ownership rules.

---

## Features

### Authentication

* User registration and login
* JWT-based authentication
* Protected API routes

### Projects

* Project creation (admin only)
* View all projects (authenticated users)

### Bugs

* Create bugs inside projects
* Bug status flow:
  **Open → In Progress → Resolved → Closed**
* Assign bugs to users
* Filter bugs by status and priority

### Comments

* Add comments on bugs
* View all comments for a bug

Text-based tracking only.

---

## Roles and Permissions

### User

* Register and login
* View projects
* Create bugs
* Comment on bugs
* Update bug status if assigned

### Admin

* All user permissions
* Create projects
* Assign bugs to users

---

## Authorization Rules

* JWT is required for all protected routes
* Only admins can create projects
* Only admins can assign bugs
* Only the bug creator or assigned user can update a bug
* Users cannot access or modify data they do not own

All checks are enforced at the API level.

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
│   ├── .env.example
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
* status (open, in-progress, resolved, closed)
* priority (low, medium, high)
* projectId
* createdBy
* assignedTo

### Comment

* bugId
* text
* userId

---

## API List (Actual Routes)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Projects

* `POST /api/projects` (admin only)
* `GET /api/projects`

### Bugs

* `POST /api/projects/:projectId/bugs`
* `GET /api/bugs`
* `PUT /api/bugs/:bugId`
* `PUT /api/bugs/:bugId/assign` (admin only)
* `DELETE /api/bugs/:bugId`

### Comments

* `POST /api/bugs/:bugId/comments`
* `GET /api/bugs/:bugId/comments`

---

## Authentication & Authorization Flow

1. User registers or logs in
2. Server returns a JWT
3. JWT is sent in `Authorization: Bearer <token>`
4. Auth middleware verifies the token
5. Role and ownership checks are applied
6. Request is allowed or rejected

---

## Local Setup

### Backend

```
cd server
npm install
npm run dev
```

Create `.env` using `.env.example`

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

## Postman Collection

A Postman collection is included to test the full backend flow end-to-end.

The collection covers:

* User registration
* Login and JWT token handling
* Project creation and listing
* Bug creation inside a project
* Bug assignment (admin only)
* Bug status updates
* Adding and fetching comments
* Bug deletion

### Collection Flow

* `login` request stores the JWT token as a **collection variable** (`token`)
* `create project` stores `projectId`
* `create bug` stores `bugId`
* Subsequent requests reuse these variables automatically

This allows the evaluator to run the collection in order without manual copy-paste.

Authorization is tested using:

```
Authorization: Bearer {{token}}
```

Ownership and role restrictions can be verified by logging in as different users.

---
