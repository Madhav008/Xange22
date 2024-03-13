const mongoose = require('mongoose');

const BattingPointsSchema = new mongoose.Schema({
    format: String,
    run: Number,
    boundary: Number,
    six: Number,
    halfCenturyBonus: Number,
    centuryBonus: Number,
});

const BattingPoints = mongoose.model('BattingPoints', BattingPointsSchema);
module.exports = BattingPoints