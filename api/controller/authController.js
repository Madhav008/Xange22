const { google } = require('googleapis');
require('dotenv').config();
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');
const router = require("express").Router();
const bcrypt = require("bcrypt");

const { createWalletHelper } = require('./walletcontroller');



// Secret key for JWT
const jwtSecret = process.env.JWT_SECRET;

// Replace with your Google OAuth2.0 credentials
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);


const googleLogin = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
  res.redirect(authUrl);
}


const googleCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
      version: 'v2',
      auth: oauth2Client,
    });

    const { data } = await oauth2.userinfo.get();

    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ googleId: data.id });

      if (!user) {
        // If the user doesn't exist, create a new user
        user = new User({
          googleId: data.id,
          displayName: data.name,
          email: data.email,
          image: data.picture
        });
        // Save the user to the database
        await user.save();
      }

      // Create a JWT token with user data
      const token = jwt.sign({ userData: data }, jwtSecret, {
        expiresIn: '30d',
      });

      // Set the JWT token in the response body
      res.status(200).json({ user, token });

    } catch (error) {
      console.log(error.message)
    }

  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const successEndpoint = (async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    // Verify the JWT token
    jwt.verify(token, jwtSecret, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      const userData = decoded.userData;
      console.log('User Data:', userData);
      await createWalletHelper(userData.id)
      res.status(200).json({ authenticated: true, user: userData });
    });
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).send('Unauthorized');
  }
});

//Regiuseter
const register = async (req, res) => {
  try {
    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // User with the provided email already exists
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate password hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
      displayName: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const newUser = await user.save();

    // Create a JWT token for the new user
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '30d' });

    // Create a wallet for the new user
    await createWalletHelper(newUser._id.toString());

    // Return the new user and the token in the response
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json(error);
  }
};


//lOGIN USER
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '30d' });

    // Include the token in the response
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json(error);
  }
}


//USER
const user = async (req, res) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    try {
      token = req.headers.authorization.split(' ')[1]
      if (!token) {
        res.status(401).json({ message: "Not authorized, no token" })
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      let user = await User.findById(decoded.userId).select('-password')

      res.status(200).json({ user })
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }



}


module.exports = router;

module.exports = {
  googleLogin,
  googleCallback,
  successEndpoint,
  register, login, user
};
