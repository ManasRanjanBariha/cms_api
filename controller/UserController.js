const sequelize = require('../config/database');
const User = require('../models/user');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {generateAccessToken,generateRefreshToken} = require('../helper/tokenHelper')

exports.register = async (req, res) => {
    const { username, password, email, phone_number } = req.body;

    // Check if all fields are provided
    if (!username) {
        return res.status(400).json({ message: 'Username is missing.' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is missing.' });
    }
    if (!email) {
        return res.status(400).json({ message: 'Email is missing.' });
    }
    if (!phone_number) {
        return res.status(400).json({ message: 'Phone number is missing.' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with phone number
        const user = await User.create({
            username,
            email,
            phone_number,
            password: hashedPassword,
            

        });

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Server error.' + error });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;

  
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
       
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate access and refresh tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);


        return res.status(200).json({
            message: 'Login successful.',
            accessToken,
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({ error: 'Server error.' });
    }
};

exports.getProfile = async (req, res) => {
    try {
      const user = req.user; // This should be set by the authenticateToken middleware
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Respond with user details
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Server error.' });
    }
  };

exports.updateProfile = async (req, res) => {
    const { username, email, phone_number } = req.body;
  
    try {
      const user = req.user; 
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  

      if (username) user.username = username;
      if (email) user.email = email;
      if (phone_number) user.phone_number = phone_number;
  
      await user.save(); 
  
      res.json({
        message: 'User profile updated successfully.',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone_number: user.phone_number
        }
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Server error.' });
    }
  };
  
  
  exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) return res.sendStatus(401); 
  

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
      if (err) return res.sendStatus(403); 
  
      try {

        const foundUser = await User.findByPk(user.id);
        if (!foundUser) return res.sendStatus(404); 

        const accessToken = generateAccessToken();
  
        const newRefreshToken = generateRefreshToken();
  
        res.json({
          accessToken,
          refreshToken: newRefreshToken
        });
      } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Server error.' });
      }
    });
  };