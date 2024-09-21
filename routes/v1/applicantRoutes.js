const express = require('express');
const router = express.Router();
// const {register,login,getProfile,updateProfile,logout} = require('../../controller/authController');
const authenticateToken =require('../../middleware/userMiddleware');
const { apply } = require('../../controller/applicantController');


router.post('/',authenticateToken,apply);

module.exports =router