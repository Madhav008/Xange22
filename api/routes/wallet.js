const express = require('express');
const router = express.Router();
const apiController = require('../controller/walletcontroller');
const { protect } = require('../midleware/authmiddlware');

// Example protected API route
router.post('/createwallet', apiController.createwallet);
router.get('/getbalance/:userid', protect, apiController.getwallet);

router.post('/deposit', protect, apiController.deposit);
router.post('/withdraw', protect, apiController.withdraw);


router.get('/gettransactions', protect, apiController.getTransactions);
router.get('/getusertransactions/:walletId', protect, apiController.getUserTransactions);
router.put('/updatetransaction/:transactionId', protect, apiController.updateTransaction);


// Example protected API routes for admin
router.get('/getpendingdeposits', protect, apiController.getPendingDeposits);
router.get('/getpendingwithdrawals', protect, apiController.getPendingWithdrawals);



module.exports = router;
