
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');


const InvalidateToken = require('../models/invalidateToken');
const { generateAccessToken, generateRefreshToken } = require('../helper/tokenHelper');
const formatResponse = require('../utils/formatResponse');
const generateUserCode = require('../utils/generateUserCode');
const { Authentication, Applicant } = require('../models');

const register = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;
        const userCode = await generateUserCode();
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await Applicant.findOne({
            where: {
                [Op.or]: [
                    { email: email },
                    { phone: phone }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json(formatResponse(400, false, "Email or phone number already exists", null));
        }


        const newAuth = await Authentication.create({
            user_code: userCode,
            password: hashedPassword,
            created_by: userCode,
            updated_by: userCode
        });

        const newApplicant = await Applicant.create({
            applicant_code: newAuth.user_code,
            username,
            phone,
            email,
            created_by: userCode,
            updated_by: userCode,
        });

        return res.status(201).json(formatResponse(201, true, "Account created successfully", newApplicant))

    } catch (error) {
        console.error(error);
        return res.status(500).json(formatResponse(500, false, "Internal server error", null));
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: 'Username and password are required.'
        });
    }

    try {
        const applicant = await Applicant.findOne({
            where: {
                [Op.or]: [
                    { email: username },
                    { phone: username },
                    { username: username } 
                ]
            }
        });

        if (!applicant) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const authUser = await Authentication.findOne({ where: { user_code: applicant.applicant_code } });

        if (!authUser) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const isMatch = await bcrypt.compare(password, authUser.password);
        if (!isMatch) {
            return res.status(401).json({
                statusCode: 401,
                success: false,
                message: 'Invalid credentials.'
            });
        }

        const accessToken = generateAccessToken(applicant); 
        const refreshToken = generateRefreshToken(applicant); 

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Login successful.',
            accessToken,
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Server error.',
            error: error.message
        });
    }
};




const logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(400).json({
        statusCode: 400,
        success: false,
        message: 'No token provided'
    });

    try {
        await InvalidateToken.create({ token });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// const getProfile = async (req, res) => {
//     try {
//         const user = await User.findByPk(req.user.id);

//         if (!user) {
//             return res.status(404).json({
//                 statusCode: 404,
//                 success: false,
//                 message: 'User not found.'
//             });
//         }

//         res.json({
//             statusCode: 200,
//             success: true,
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email,
//                 phone_number: user.phone_number
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching user profile:', error);
//         res.status(500).json({
//             statusCode: 500,
//             success: false,
//             message: 'Server error.',
//             error: error.message
//         });
//     }
// };


// const updateProfile = async (req, res) => {
//     const { username, email, phone_number } = req.body;

//     try {
//         const user = await User.findByPk(req.user.id);
//         if (!user) {
//             return res.status(404).json({
//                 statusCode: 404,
//                 success: false,
//                 message: 'User not found.'
//             });
//         }

//         if (username) user.username = username;
//         if (email) user.email = email;
//         if (phone_number) user.phone_number = phone_number;

//         await user.save();

//         res.json({
//             statusCode: 200,
//             success: true,
//             message: 'User profile updated successfully.',
//             user: {
//                 id: user.id,
//                 username: user.username,
//                 email: user.email,
//                 phone_number: user.phone_number
//             }
//         });
//     } catch (error) {
//         console.error('Error updating user profile:', error);
//         res.status(500).json({
//             statusCode: 500,
//             success: false,
//             message: 'Server error.',
//             error: error.message
//         });
//     }
// };



// const refreshToken = async (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) return res.status(401).json({
//         statusCode: 401,
//         success: false,
//         message: 'No refresh token provided.'
//     });

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
//         if (err) return res.status(403).json({
//             statusCode: 403,
//             success: false,
//             message: 'Invalid refresh token.'
//         });

//         try {
//             const foundUser = await User.findByPk(user.id);
//             if (!foundUser) return res.status(404).json({
//                 statusCode: 404,
//                 success: false,
//                 message: 'User not found.'
//             });

//             const accessToken = generateAccessToken(foundUser);
//             const newRefreshToken = generateRefreshToken(foundUser);

//             res.json({
//                 statusCode: 200,
//                 success: true,
//                 accessToken,
//                 refreshToken: newRefreshToken
//             });
//         } catch (error) {
//             console.error('Error refreshing token:', error);
//             res.status(500).json({
//                 statusCode: 500,
//                 success: false,
//                 message: 'Server error.',
//                 error: error.message
//             });
//         }
//     });
// };



module.exports = { login, register, logout }