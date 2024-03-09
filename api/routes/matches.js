const express = require('express');
const router = express.Router();
const apiController = require('../controller/matchesController');

// Example protected API route
router.get('/upcomming', apiController.getUpcommingMacthes);
router.get('/live', apiController.getLiveMacthes);
router.get('/result', apiController.getFinishedMacthes);






module.exports = router;
