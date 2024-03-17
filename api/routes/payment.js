const express = require('express');
const router = express.Router();

const { protect } = require('../midleware/authmiddlware');
const paymentController = require('../controller/paymentController');

// Example protected API route
router.post('/create', protect, paymentController.createPayment);
router.get('/verify/:orderId', protect, paymentController.verifyPayment);


module.exports = router;
