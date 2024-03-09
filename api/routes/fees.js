const express = require('express');
const router = express.Router();

// Example protected API route
router.get('/', (req, res) => {
    res.send({ fees: 10 });
});




module.exports = router;
