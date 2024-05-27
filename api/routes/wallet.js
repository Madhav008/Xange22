const express = require('express');
const router = express.Router();
const apiController = require('../controller/walletcontroller');
const { protect, admin } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/createwallet', apiController.createwallet);
router.get('/getbalance', protect, apiController.getwallet);
router.post('/update', admin, apiController.updateWallet)

router.post('/withdraw', protect, apiController.withdraw);


router.get('/getusertransactions', protect, apiController.getUserTransactions);


// Example protected API routes for admin
router.get('/getpendingdeposits', admin, apiController.getPendingDeposits);
router.get('/getpendingwithdrawals', admin, apiController.getPendingWithdrawals);



module.exports = router;
