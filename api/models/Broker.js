const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
    brokerId: {
        type:String,
        unique: true
    },
    StandardCommissionRate: Number,
    DiscountedCommissionRate: Number,
    DiscountThreshold: Number,
});

const Broker = mongoose.model('Broker', brokerSchema);

module.exports = Broker;
