const express = require('express');
const router = express.Router();
const apiController = require('../controller/apicontrlloer');
const { protect } = require('../midleware/authmiddlware')
// Example protected API route
router.get('/', protect, apiController.protectedRoute);

module.exports = router;
