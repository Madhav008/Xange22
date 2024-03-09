const mongoose = require('mongoose');

const matchesSchema = new mongoose.Schema({
    id: String,
    seriesname: String,
    result_status: String,
    playing11_status: String,
    status: String,
    format: String,
    final_status: String,
    team1display: String,
    team2display: String,
    team1logo: String,
    team2logo: String,
    matchkey: String,
    popup_url: String,
    start_date: String,
    match_time: String,
    success: String,
    match_discount: String,
    match_status: String,
});

const RecentMatches = mongoose.model('Matches', matchesSchema);

module.exports = RecentMatches;
