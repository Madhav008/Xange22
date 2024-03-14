const express = require('express');
const router = express.Router();
const apiController = require('../controller/croncontroller');

// Example protected API route
router.get('/seed/matches', apiController.seedMatches); //seed every 2hrs
router.get('/seed/players', apiController.seedPlayers); //seed every 2hrs
router.get('/seed/login', apiController.login);
router.get('/seed/stats', apiController.seedPlayersStats); //seed every 30min for live matches and for completed 1time









module.exports = router;
