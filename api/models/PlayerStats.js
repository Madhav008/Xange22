const mongoose = require('mongoose');

const PlayerStatsSchema = new mongoose.Schema({
    name: String,
    role: String,
    is_premium: String,
    player_rate: String,
    buy_rate: String,
    sell_rate: String,
    playerkey: String,
    matchkey: String,
    is_disable_buy: { type: Boolean, default: false }, // Updated default value to false
    is_disable_sell: { type: Boolean, default: false }, // Updated default value to false
    image: String,
    team: String,
    teamname: String,
    total_stock: Number
});

const PlayerStats = mongoose.model('Player', PlayerStatsSchema);

module.exports = { PlayerStats };
