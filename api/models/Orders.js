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
    timestamp: String,
    playerId: String,
    matchId: String,
    teamId: String,
    fees: Number,
    is_filled: Boolean,
    profit: { type: Number, default: 0.0 }
});

const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;
