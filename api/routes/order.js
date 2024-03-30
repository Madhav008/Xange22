const express = require('express');
const router = express.Router();
const apiController = require('../controller/orderscontroller');
const { protect } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/create', protect, apiController.createOrder);
router.get('/:userId', protect, apiController.getUserOrders);






module.exports = router;
