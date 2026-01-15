/**
 * auth.js
 * Authentication middleware used to protect private API routes.
 * It verifies the JWT token sent by the client and allows access
 * only to authenticated users.
 */

const jwt = require('jsonwebtoken');

// Load environment variables (JWT secret)
require('dotenv').config();

// Secret key used to sign and verify JWT tokens
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware function that checks if a valid JWT token is present.
 * If valid, the decoded user data is attached to the request object.
 */
function authenticateToken(req, res, next) {
  // Read Authorization header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, deny access
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. Login required to view this resource.' });
  }

  // Verify the token using the secret key
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: 'Invalid or expired token. Please log in again.' });
    }

    // Attach decoded user information to request
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
}

// Export middleware so it can be used in routes
module.exports = authenticateToken;
