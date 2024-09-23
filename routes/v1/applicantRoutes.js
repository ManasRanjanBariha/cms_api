const express = require('express');
const router = express.Router();
// const {register,login,getProfile,updateProfile,logout} = require('../../controller/authController');
const authenticateToken =require('../../middleware/userMiddleware');
const { apply,view } = require('../../controller/applicantController');
const upload = require('../../middleware/upload');


router.put('/',authenticateToken,upload.single('file'),apply);

router.get('/:applicantCode/:jobCode',authenticateToken,view);

module.exports =router