const express = require('express');
const router = express.Router();

const { protect } = require('../midleware/authmiddlware');
const createPayment = require('../controller/paymentController');

// Example protected API route
router.post('/create', protect, createPayment);

module.exports = router;
