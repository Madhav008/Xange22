const express = require('express');
const router = express.Router();
const apiController = require('../controller/croncontroller');

// Example protected API route
router.get('/seed/matches', apiController.seedMatches);
router.get('/seed/players', apiController.seedPlayers);
router.get('/seed/login', apiController.login);








module.exports = router;
