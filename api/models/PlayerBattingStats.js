const mongoose = require('mongoose');

const BattingSchema = new mongoose.Schema({
    playerId: String,
    matchId: String,
    bats_runs: Number,
    four_hit: Number,
    six_hit: Number,
    balls_faced: Number,
    fifty: Number,
    hundred: Number,
    isBat:Boolean,
    points:Number,
});

const BattingStats = mongoose.model('BattingStats', BattingSchema);

module.exports = BattingStats;
