const jwt = require('jsonwebtoken');
const InvalidateToken = require('../models/invalidateToken');

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) return res.sendStatus(401);

  try {

      const invalidateToken = await InvalidateToken.findOne({ where: { token } });
      if (invalidateToken) return res.sendStatus(401); 

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
          if (err) return res.sendStatus(403);
          req.user = user;
          next();
      });
  } catch (error) {
      res.status(500).json({ message: 'Server error'+error });
  }
  };
  

module.exports = authenticateToken;
