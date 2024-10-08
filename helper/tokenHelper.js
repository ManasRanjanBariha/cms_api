const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, applicant_code: user.applicant_code }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });
};


const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, applicant_code: user.applicant_code }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};