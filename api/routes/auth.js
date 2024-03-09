const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Google login route
router.get('/google/login', authController.googleLogin);
// Success endpoint
router.get('/success', authController.successEndpoint);

router.get('/google/callback', authController.googleCallback)

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get('/logout', function (req, res) {
    res.clearCookie('token');
    res.redirect(process.env.CLIENT_URL);

})

module.exports = router;
