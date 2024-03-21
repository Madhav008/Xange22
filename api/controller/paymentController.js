const Razorpay = require('razorpay');
const { deposit } = require('./walletcontroller');

var instance = new Razorpay({
    key_id: 'rzp_test_A0j9ATFARJ8Hmm',
    key_secret: 'Qad97k63uOmklSQ476uhSg0d',
});


// Function to generate a random string
function generateRandomString(length) {
    const characters = '0123456789';
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

const createPayment = (req, res) => {
    const { amount } = req.body;
    const id = generateRandomTransactionId();
    var options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "order_rcptid_" + id,
    };

    instance.orders.create(options, function (err, order) {
        if (err) {
            console.error(err);
            return res.status(400).json({ message: "Order Not Created Successfully" });
        }
        res.status(200).json(order);
    });
}

const succesPayment = (req, res) => {
    const { userid, orderId } = req.body;
    instance.orders.fetchPayments(orderId, async function (err, paymentdata) {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: "Money Not added to Wallet" });
        }
        const amount = paymentdata.items[0].amount
        const payId = paymentdata.items[0].id
        try {
            const resp = await deposit(userid, amount, payId)
            console.log(resp);
        } catch (err) {
            console.log(err.message);
        }

        res.status(200).json({ message: "Money Added to Wallet" })
    })
}

module.exports = { createPayment, succesPayment };
