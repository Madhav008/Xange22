const express = require('express');
const router = express.Router();

const { protect } = require('../midleware/authmiddlware');
const paymentController = require('../controller/paymentController');

// Example protected API route
router.post('/create', protect, paymentController.createPayment);
router.post('/success', protect, paymentController.succesPayment);



module.exports = router;
