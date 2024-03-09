const express = require('express');
const router = express.Router();
const apiController = require('../controller/orderscontroller');

// Example protected API route
router.post('/create', apiController.createOrder);
router.post('/close', apiController.closeOrder);
router.get('/:userId', apiController.getOpenOrders);
//Todo Creae getCloseOrders of the user






module.exports = router;
