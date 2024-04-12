const express = require('express');
const router = express.Router();

const { protect } = require('../midleware/authmiddlware');
// const paymentController = require('../controller/paymentController');
const paymentController = require('../controller/cashfree');

// Example protected API route
router.post('/create', protect, paymentController.createPayment);
router.post('/order/:orderId', paymentController.verifyPayment);



module.exports = router;
