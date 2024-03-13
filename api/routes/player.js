const express = require('express');
const router = express.Router();
const apiController = require('../controller/playerController');
const { protect } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/', protect,apiController.getPlayersByMatch);

module.exports = router;
