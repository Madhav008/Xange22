const express = require('express');
const router = express.Router();
const apiController = require('../controller/orderscontroller');
const { protect, admin } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/create', protect, apiController.createOrder);
router.get('/:userId', protect, apiController.getUserOrders);
router.post('/', admin, apiController.getOrders);
router.get('/match/:matchId', admin, apiController.getMatchOrders);
router.get('/matchOrderbyUser/:matchId', admin, apiController.matchOrderbyUser);
router.put('/updateIsPayout/:orderId', admin, apiController.updateIsPayout);







module.exports = router;
