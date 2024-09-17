const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const authenticateToken =require('../middleware/userMiddleware')


router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/profile',authenticateToken,userController.getProfile)

router.put('/profile',authenticateToken,userController.updateProfile)

module.exports = router;
