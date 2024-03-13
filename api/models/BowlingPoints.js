const mongoose = require('mongoose');
const BowlingPointsSchema = new mongoose.Schema({
    format: String,
    wicket: Number,
    threeWicketHaulBonus: Number,
    fourWicketHaulBonus: Number,
    fiveWicketHaulBonus: Number,
    maidenOver: Number
});
const BowlingPoints = mongoose.model('BowlingPoints', BowlingPointsSchema);
module.exports = BowlingPoints;