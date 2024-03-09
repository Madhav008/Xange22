const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    orderType: {
        type: String,
        enum: ["buy", "sell"],
        required: true
    },
    playerId:  String,
    matchId: String,
    teamId: String,
    fees: Number,
    is_filled: Boolean
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
