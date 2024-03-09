const express = require('express');
const router = express.Router();
const apiController = require('../controller/playerController');

// Example protected API route
router.post('/', apiController.getPlayersByMatch);






module.exports = router;
