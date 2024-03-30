const express = require('express');
const router = express.Router();
const apiController = require('../controller/orderscontroller');
const { protect, admin } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/create', protect, apiController.createOrder);
router.get('/:userId', protect, apiController.getUserOrders);
router.post('/', admin, apiController.getOrders);
router.get('/match/:matchId', admin, apiController.getMatchOrders);
router.post('/player', admin, apiController.getPlayerOrders);







module.exports = router;
