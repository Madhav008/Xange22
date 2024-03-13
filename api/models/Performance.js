const mongoose = require('mongoose');

// Define batting performance schema
const BattingPerformanceSchema = new mongoose.Schema({
    runs_scored: { type: Number, required: true },
    boundaries_scored: { type: Number, required: true },
    sixes_scored: { type: Number, required: true },
    half_century: { type: Boolean, required: true },
    century: { type: Boolean, required: true }
});

// Define bowling performance schema
const BowlingPerformanceSchema = new mongoose.Schema({
    wickets_taken: { type: Number, required: true },
    maiden_overs_bowled: { type: Number, required: true },
    three_wicket_haul: { type: Boolean, required: true },
    four_wicket_haul: { type: Boolean, required: true },
    five_wicket_haul: { type: Boolean, required: true }
});

// Define fielding performance schema
const FieldingPerformanceSchema = new mongoose.Schema({
    catches_taken: { type: Number, required: true },
    run_outs_as_thrower: { type: Number, required: true },
    run_outs_as_catcher: { type: Number, required: true },
    stumpings: { type: Number, required: true }
});

// Define player performance schema
const PlayerPerformanceSchema = new mongoose.Schema({
    player_id: { type: String, required: true },
    match_id: { type: String, required: true },
    batting_performance: { type: BattingPerformanceSchema, required: true },
    bowling_performance: { type: BowlingPerformanceSchema, required: true },
    fielding_performance: { type: FieldingPerformanceSchema, required: true },
    total_points: { type: Number, required: true },
    match_format: { type: String, required: true },
});

// Create model for player performance
const PlayerPerformance = mongoose.model('PlayerPerformance', PlayerPerformanceSchema);

module.exports = PlayerPerformance;
