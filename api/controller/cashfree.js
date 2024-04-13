const { Cashfree } = require('cashfree-pg');
const { deposit } = require('./walletcontroller');
const { Transaction } = require('../models/Wallet');
// Set Cashfree configuration
Cashfree.XClientId = "65195559b737f77b10e3871f83559156";
Cashfree.XClientSecret = "cfsk_ma_prod_7073fb61abe9ae558404635fb54b1bb7_565e6c2c";


// Cashfree.XClientId = "TEST10153525c6970250b6cbc2af71bc52535101";
// Cashfree.XClientSecret = "cfsk_ma_test_4e874d1954d70c40bf1be3477a2d9cda_eb18c688";
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

// Function to generate a random string
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Generate random transaction ID with prefix "txn_"
function generateRandomTransactionId() {
    const prefix = "txn_";
    const timestamp = Date.now(); // Gets the current timestamp
    const randomString = generateRandomString(6); // You can adjust the length as needed
    return prefix + randomString + timestamp;
}

const createPayment = async (req, res) => {

    const { amount, userid } = req.body;
    const transactionId = generateRandomTransactionId();

    var request = {
        "order_amount": amount,
        "order_currency": "INR",
        "order_id": transactionId,
        "customer_details": {
            "customer_id": userid, 'customer_phone': '1234567890'
        },
        "order_meta": {
            "return_url": `https://fanxange.live/redirect/${transactionId}`
        }
    };

    try {
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Order Not Created Successfully" });
    }
}

const verifyPayment = async (req, res) => {
    const { orderId } = req.params;
    try {
        const response = await Cashfree.PGFetchOrder("2023-08-01", orderId);
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.response.data.message });
    }
}

const checkPaymentStatus = async (req, res) => {
    const { orderId } = req.params;
    try {
        const response = await Cashfree.PGFetchOrder("2023-08-01", orderId);
        const orderData = response.data;
        const status = orderData.order_status;

        // Check if the transaction has already been processed
        const existingTransaction = await Transaction.findOne({ transactionId: orderId });
        if (status === 'PAID' && (existingTransaction == null)) {
            const userid = orderData.customer_details.customer_id;
            const amount = orderData.order_amount;
            await deposit(userid, amount, orderId);

            // Mark this transaction as processed
            if (existingTransaction) {
                existingTransaction.processed = true;
                await existingTransaction.save();
            }
            res.status(200).json({ "success": true });
        } else if (status !== 'PAID') {
            res.status(200).json({ "success": false });
        } else {
            res.status(200).json({ "success": true, "message": "Order already processed" });
        }
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.response ? error.response.data.message : error.message });
    }
}

module.exports = { createPayment, verifyPayment, checkPaymentStatus };
