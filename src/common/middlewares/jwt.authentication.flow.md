# JWT Authentication – Complete End‑to‑End Flow

This document explains **JWT authentication from login to protected requests**, step‑by‑step, with **clear explanations and sample code**. It is written so you can **read it later like notes** and directly relate it to your codebase.

---

## 1️⃣ Login Request (Client → Backend)

The client sends login credentials to the backend.

**Example request**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@mail.com",
  "password": "password123"
}
```

At this point:
- No token exists yet
- Client is only requesting authentication

---

## 2️⃣ Controller Receives Login Request

**File:** `auth.controller.js`

```js
export const login = async (req, res) => {
  const token = await loginUser(req.body);
  res.json({ token });
};
```

What happens here:
- Controller receives email & password
- Controller does NOT create token
- Controller forwards data to service

---

## 3️⃣ Service Verifies User & Creates JWT Token

**File:** `auth.service.js`

```js
import jwt from "jsonwebtoken";

export const loginUser = async ({ email, password }) => {
  // user verification logic (DB + bcrypt)

  const token = jwt.sign(
    { userId: user._id },          // PAYLOAD (added by you)
    process.env.JWT_SECRET,        // SIGNING KEY
    { expiresIn: "7d" }           // EXPIRY RULE
  );

  return token; // returns a STRING
};
```

Important points:
- `jwt.sign()` creates a **JWT token string**
- The token internally contains:
  - `userId` (you explicitly put it)
  - `iat` (auto‑added by JWT – issued at)
  - `exp` (auto‑added by JWT based on `expiresIn`)
- `JWT_SECRET` is used to **sign** the token (not hash)

---

## 4️⃣ Backend Sends Token to Client

**Example response**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

After this:
- Backend does NOT store the token
- Backend is stateless
- Token now lives with the client

---

## 5️⃣ Client Stores the Token

Client stores the **token string**, not the decoded object.

Examples:
- Postman → environment variable
- Frontend → memory / localStorage / secure storage

⚠️ Important:
- The payload (`userId`, `iat`, `exp`) is **inside the token**
- The payload is **NOT stored separately in headers**

---

## 6️⃣ Client Makes a Protected Request (Future Request)

For every protected API call, the client attaches the **same token string**.

**Example request**
```http
POST /api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fullName": "Akash Singh",
  "bio": "Backend learner"
}
```

Important clarification:
- The **Authorization header only carries the token string**
- Payload remains inside the token
- Client may continue sending the token even after expiry

---

## 7️⃣ Auth Middleware Runs Before Controller

**File:** `auth.middleware.js`

```js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId; // attach identity to request

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
```

What happens here step‑by‑step:
- Token string is extracted from header
- `jwt.verify()`:
  - verifies token signature using `JWT_SECRET`
  - checks token expiry (`exp`)
  - decodes payload from token

---

## 8️⃣ What `jwt.verify()` Returns

```js
decoded = {
  userId: "65b8f3c0a9c12a001f4b2e91",
  iat: 1700000000,
  exp: 1700600000
};
```

Why these fields exist:
- `userId` → you added it in `jwt.sign()`
- `iat` → auto‑added by JWT
- `exp` → auto‑added by JWT using `expiresIn`

No imports are needed because:
- Data comes from **inside the token itself**

---

## 9️⃣ Attaching User Identity to the Request

```js
req.userId = decoded.userId;
```

Meaning:
- `req` is a plain JavaScript object
- You attach `userId` dynamically
- This exists only for the current request

Controllers and services can now safely access:
```js
const userId = req.userId;
```

---

## 🔑 Important Clarification About Token Expiry

❌ Incorrect idea:
> Token disappears after expiry

✅ Correct idea:
> Token stays with the client until removed, but the backend rejects it once `exp` is passed.

- Client may still send an expired token
- Backend rejects it during `jwt.verify()`

---

## 🔁 Complete Flow Summary (One Line)

```
Login → Token created (jwt.sign) → Token sent to client → Client stores token →
Client sends token in Authorization header → Middleware verifies & decodes token →
req.userId attached → Controller & Service use userId
```

---

## ✅ Final Lock‑In Statement

**JWT authentication works because identity data is embedded inside a signed token string that the client sends with each request, and the backend verifies and decodes that data from the token itself—without sharing memory, importing variables, or storing sessions.**

