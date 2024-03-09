const express = require('express');
const router = express.Router();
const apiController = require('../controller/performanceController');

// Example protected API route
router.get('/players', apiController.SeedPlayerPerformance);
router.get('/:playerId', apiController.PerformanceRoute);
// router.get('/latest/:playerId', apiController.LatestPerformance);






module.exports = router;
