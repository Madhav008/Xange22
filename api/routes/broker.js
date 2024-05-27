const express = require('express');
const router = express.Router();
const BrokerController = require('../controller/brokerController');
const { protect } = require('../midleware/authmiddlware');

// Create a new broker
router.post('/',protect, BrokerController.createBroker);

// Get all brokers
router.get('/', protect,BrokerController.getBrokers);

// Get a single broker by ID
router.get('/:id', protect,BrokerController.getBroker);

// Get users by BrokerId
router.get('/users/:id', protect,BrokerController.getUsersByBrokerId);

// Update a broker by ID
router.put('/:id', protect,BrokerController.updateBroker);

// Delete a broker by ID
router.delete('/:id', protect,BrokerController.deleteBroker);



module.exports = router;
