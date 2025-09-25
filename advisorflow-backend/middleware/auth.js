import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');

  // Check if no token is provided
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // The token should be in the format "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Token format is invalid' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user payload to the request object
    req.user = decoded.user;
    next(); // Move on to the next middleware or the route handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;