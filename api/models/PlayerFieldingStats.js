const mongoose = require('mongoose');

const FieldingSchema = new mongoose.Schema({
    playerId: String,
    matchId: String,
    catches: Number,
    runouts: Number,
    stumping: Number,
    points: Number,
});

const FieldingStats = mongoose.model('FieldingStats', FieldingSchema);

module.exports = FieldingStats;
