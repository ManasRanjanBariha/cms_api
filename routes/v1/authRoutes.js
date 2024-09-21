const express = require('express');
const router = express.Router();
const {register,login,getProfile,updateProfile,logout} = require('../../controller/authController');
const authenticateToken =require('../../middleware/userMiddleware')


router.post('/register', register);

router.post('/login', login);

// router.get('/profile',authenticateToken,getProfile)

// router.put('/profile',authenticateToken,updateProfile)

// router.get('/logout',logout)

module.exports = router;
