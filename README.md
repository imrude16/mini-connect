# Mini-Connect Backend – Complete Technical Report

---

## 1. Project Overview

**Mini-Connect** is a full-featured, production-aligned backend for a social-platform-style application. The project was built to strengthen real-world backend engineering skills, focusing on clean architecture, scalability, data integrity, and developer experience.

The backend supports:
- User authentication and authorization
- User profiles with media uploads
- Social interactions (posts, likes, comments, replies)
- Notifications (database + real-time)
- Aggregated feeds
- Pagination, search, and filters

---

## 2. Technology Stack & Libraries

### Core Runtime
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework for routing and middleware

### Database Layer
- **MongoDB** – NoSQL database
- **Mongoose** – ODM for schema modeling, population, and transactions

### Authentication & Security
- **JWT (jsonwebtoken)** – Token-based authentication
- **bcrypt** – Password hashing

### Validation & File Handling
- **Joi** – Request payload validation
- **Multer** – File uploads (profile pictures, post images)

### Real-Time Communication
- **Socket.IO** – Real-time notifications

### Tooling
- **dotenv** – Environment variable management
- **nodemon** – Development server auto-reload
- **Postman** – API testing

---

## 3. Folder & File Architecture

```
src/
│── app.js
│── server.js
│
├── common/
│   └── middlewares/
│       └── auth.middleware.js
│
├── infrastructure/
│   ├── database/
│   │   └── connectDB.js
│   ├── storage/
│   │   └── multer.config.js
│   └── socket/
│       └── socket.js
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.route.js
│   │   └── auth.validation.js
│   │
│   ├── profile/
│   │   ├── profile.model.js
│   │   ├── profile.controller.js
│   │   ├── profile.service.js
│   │   ├── profile.route.js
│   │   └── profile.validation.js
│   │
│   ├── post/
│   │   ├── post.model.js
│   │   ├── post.controller.js
│   │   ├── post.service.js
│   │   ├── post.route.js
│   │   └── post.validation.js
│   │
│   ├── comment/
│   │   ├── comment.model.js
│   │   ├── comment.controller.js
│   │   ├── comment.service.js
│   │   └── comment.route.js
│   │
│   ├── notification/
│   │   ├── notification.model.js
│   │   ├── notification.service.js
│   │   ├── notification.controller.js
│   │   └── notification.route.js
│   │
│   └── feed/
│       ├── feed.service.js
│       ├── feed.controller.js
│       └── feed.route.js
│
└── uploads/
```

**Architecture Principles:**
- Routes handle HTTP concerns only
- Controllers orchestrate request/response
- Services contain business logic
- Models define database schema
- Infrastructure isolates external concerns (DB, storage, sockets)

---

## 4. Backend Concepts Covered

### Core Backend Concepts
- JWT-based authentication & authorization
- Middleware-driven request protection
- Role of controllers vs services
- Async/await, try–catch, promises

### Database Concepts
- Schema design & relationships
- Population (`populate`)
- Aggregation pipelines
- MongoDB transactions (atomic writes)

### Advanced Topics
- Aggregated feed generation
- Pagination strategies
- Search and filtering
- Real-time notifications (Socket.IO)
- Defensive coding & error handling

---

## 5. End-to-End Data Flow

### 5.1 Registration & Login Flow
1. Client sends registration data
2. Controller validates input (Joi)
3. Service hashes password and saves user
4. Login validates credentials
5. JWT token generated with payload `{ userId }`
6. Token returned to client

### 5.2 Authenticated Request Flow
1. Client sends request with `Authorization: Bearer <token>`
2. Auth middleware verifies token using `JWT_SECRET`
3. `req.userId` is attached
4. Request proceeds to controller & service

### 5.3 Content & Engagement Flow
- Posts are created with optional images
- Likes toggle and trigger notifications
- Comments and replies are nested
- Notifications are saved and emitted in real-time
- Feed API aggregates all related data

---

## 6. API Endpoints & Postman Testing Guide

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Profile
- `POST /api/profile` (form-data, JWT required)

### Posts
- `POST /api/posts` (form-data)
- `GET /api/posts?page=&limit=`
- `POST /api/posts/:postId/like`

### Comments & Replies
- `POST /api/posts/:postId/comments`
- `POST /api/posts/:postId/comments/:commentId/replies`
- `DELETE /api/comments/:commentId`
- `GET /api/posts/:postId/comments?page=&limit=`

### Notifications
- `GET /api/notifications?page=&limit=`
- `PATCH /api/notifications/:notificationId/read`

### Feed (Aggregation)
- `GET /api/feed?page=&limit=&search=&userId=&sort=&from=&to=`

Each protected route requires:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 7. Common Errors & Debugging Guide

### 1. `Cannot read properties of undefined`
- Cause: Missing return from service
- Fix: Ensure all code paths return expected data

### 2. `Cannot POST /api/...`
- Cause: Route mismatch
- Fix: Verify `app.use()` base path + route path

### 3. Token Errors (`jwt malformed`)
- Cause: Missing or invalid Authorization header
- Fix: Ensure `Bearer <token>` format

### 4. Multer Upload Issues
- Cause: Wrong `form-data` key
- Fix: Match key with `upload.single("fieldName")`

### 5. Transaction Failures
- Cause: Missing session propagation
- Fix: Pass `{ session }` to all related writes

---

## 8. Final Status

**Mini-Connect Backend** is a complete, scalable, production-aligned backend MVP.

It demonstrates real-world backend engineering practices and serves as a strong foundation for frontend integration, further scaling, or domain-specific adaptation (e.g., JAIRAM).

---

**End of Report**
