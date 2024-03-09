const mongoose = require('mongoose');

const FeesSchema = new mongoose.Schema({
    fees: Number
});

const Fees = mongoose.model('Fees', FeesSchema);

module.exports = { Fees };
