const express = require('express');
const router = express.Router();
const apiController = require('../controller/orderscontroller');
const { protect } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/create', protect, apiController.createOrder);
router.post('/close', protect, apiController.closeOrder);
router.get('/:userId', protect, apiController.getUserOrders);
//Todo Creae getCloseOrders of the user






module.exports = router;
