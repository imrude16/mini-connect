import jwt from "jsonwebtoken";

/*
  AUTH MIDDLEWARE
  This function runs BEFORE protected routes
*/
const authMiddleware = (req, res, next) => {
  try {
    /*
      Step 1: Read Authorization header

      Expected format:
      Authorization: Bearer <token>
    */
    const authHeader = req.headers.authorization;

    // If header is missing
    if (!authHeader) {
      return res.status(401).json({
        message: "Authorization header missing"
      });
    }

    /*
      Step 2: Extract token from header
      "Bearer tokenvalue" → ["Bearer", "tokenvalue"]
    */
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    /*
      Step 3: Verify token
      If invalid → jwt throws error
    */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      Step 4: Attach userId to request object
      This is the KEY step
    */
    req.userId = decoded.userId;

    /*
      Step 5: Allow request to continue
    */
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;


/*AUTH FLOW OVERVIEW

Client sends login request
↓
Backend verifies credentials
↓
Backend generates JWT token
↓
Backend sends token to client
↓
Client stores token
↓
Client attaches token to future requests

*/
