const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    stockId: { type: String, required: true },
    brokerId: { type: String, required: true },
    orderType: {
        type: String,
        enum: ["Buy", "Sell"],
        required: true
    },
    quantity: { type: Number, required: true },
    priceAtOrder: { type: Number, required: true },
    commissionPaid: { type: Number, required: true },
    orderDate: Date,
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        required: true
    },
    closedPrice: { type: Number },
},
{ timestamps: true, }
);
const Orders = mongoose.model('Orders', orderSchema);

module.exports = Orders;

