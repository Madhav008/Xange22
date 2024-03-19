const { Cashfree } = require('cashfree-pg');

// Set Cashfree configuration
Cashfree.XClientId = "65195559b737f77b10e3871f83559156";
Cashfree.XClientSecret = "cfsk_ma_prod_7073fb61abe9ae558404635fb54b1bb7_565e6c2c";
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
    const randomString = generateRandomString(6); // You can adjust the length as needed
    return prefix + randomString;
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
            "return_url": "https://www.cashfree.com/devstudio/preview/pg/mobile/hybrid?order_id={order_id}"
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

module.exports = { createPayment, verifyPayment };
