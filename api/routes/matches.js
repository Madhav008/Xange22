const express = require('express');
const router = express.Router();
const apiController = require('../controller/matchesController');
const { protect, admin } = require('../midleware/authmiddlware');

// Example protected API route
router.get('/list', protect, apiController.getUpcommingMacthes);
router.get('/ipodetails/:iponame', protect, apiController.getMatchDetail);
router.post('/ipodetails/:iponame', admin, apiController.updateMatch);

module.exports = router;
