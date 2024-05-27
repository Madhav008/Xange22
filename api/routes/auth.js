const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/user", authController.user);
router.post('/forget', authController.forget);
router.post('/verify', authController.verify);
router.post('/reset', authController.resetPassword);



router.get('/logout', function (req, res) {
    res.clearCookie('token');
    res.redirect(process.env.CLIENT_URL);

})

module.exports = router;
