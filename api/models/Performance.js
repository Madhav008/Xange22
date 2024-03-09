const mongoose = require('mongoose');

const PerformanceSchema = new mongoose.Schema({
    playerId: String,
    matchId: String,
    price: String,
    old_price: String,
    total_points: String,
    avg_points: String,
    change_price: String,
    change_percent: String,
    date: String,
});

const Performance = mongoose.model('Performance', PerformanceSchema);

module.exports = Performance;
