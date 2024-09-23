const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponse');

let invalidatedTokens = [];

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json(formatResponse(401, false, 'Unauthorized: No token provided.', null));
    }

    if (invalidatedTokens.includes(token)) {
        return res.status(401).json(formatResponse(401, false, 'Unauthorized: Token has been invalidated.', null));
    }

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json(formatResponse(403, false, 'Forbidden: Invalid token.', null));
            }
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json(formatResponse(500, false, 'Server error: ' + error.message, null));
    }
};


module.exports = authenticateToken;
