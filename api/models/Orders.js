const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    UserID: String,
    StockID: String,
    BrokerID: String,
    orderType: {
        type: String,
        enum: ["Buy", "Sell"],
        required: true
    },
    quantity: Number,
    priceAtOrder: Number,
    commissionPaid: Number,
    orderDate: Date,
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        required: true
    },
});
const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;

