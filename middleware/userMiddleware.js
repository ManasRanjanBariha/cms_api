const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as needed

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.sendStatus(401); // No token provided
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          // Handle expired token
          return res.status(401).json({ message: 'Access token expired. Please refresh your token.' });
        }
        return res.sendStatus(403); // Invalid token
      }
  
      try {
        req.user = await User.findByPk(user.id);
        if (!req.user) return res.sendStatus(404); // User not found
        next();
      } catch (error) {
        console.error('Error verifying user:', error);
        return res.sendStatus(500); // Server error
      }
    });
  };
  

module.exports = authenticateToken;
