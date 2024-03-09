const express = require('express');
const router = express.Router();
const apiController = require('../controller/walletcontroller');

// Example protected API route
router.post('/createwallet', apiController.createwallet);
router.get('/getbalance/:userid', apiController.getwallet);

router.post('/deposit', apiController.deposit);
router.post('/withdraw', apiController.withdraw);


router.get('/gettransactions', apiController.getTransactions);
router.get('/getusertransactions/:walletId', apiController.getUserTransactions);
router.put('/updatetransaction/:transactionId', apiController.updateTransaction);


// Example protected API routes for admin
router.get('/getpendingdeposits', apiController.getPendingDeposits);
router.get('/getpendingwithdrawals', apiController.getPendingWithdrawals);



module.exports = router;
