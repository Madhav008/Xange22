const express = require('express');
const router = express.Router();
const apiController = require('../controller/matchesController');
const { protect, admin } = require('../midleware/authmiddlware');

// Example protected API route
router.get('/upcomming', protect, apiController.getUpcommingMacthes);
router.get('/live', protect, apiController.getLiveMacthes);
router.get('/result', protect, apiController.getFinishedMacthes);
router.put('/updatematch/:matchId', admin, apiController.updateMatch);





module.exports = router;
