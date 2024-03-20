const mongoose = require('mongoose');


//Define the points-score schecma
const PointScoreSchema = new mongoose.Schema({
    score: { type: Number, required: true, default: 0 },
    point: { type: Number, required: true, default: 0 },
})
// Define batting performance schema
const BattingPerformanceSchema = new mongoose.Schema({
    runs_scored: { type: PointScoreSchema, required: true },
    boundaries_scored: { type: PointScoreSchema, required: true },
    sixes_scored: { type: PointScoreSchema, required: true }
});

// Define bowling performance schema
const BowlingPerformanceSchema = new mongoose.Schema({
    wickets_taken: { type: PointScoreSchema, required: true },
    maiden_overs_bowled: { type: PointScoreSchema, required: true },
});

// Define fielding performance schema
const FieldingPerformanceSchema = new mongoose.Schema({
    catches_taken: { type: PointScoreSchema, required: true },
    run_outs_as_thrower: { type: PointScoreSchema, required: true },
    run_outs_as_catcher: { type: PointScoreSchema, required: true },
    stumpings: { type: PointScoreSchema, required: true }
});

// Define player performance schema
const PlayerPerformanceSchema = new mongoose.Schema({
    player_id: { type: String, required: true },
    match_id: { type: String, required: true },
    batting_performance: { type: BattingPerformanceSchema, required: true },
    bowling_performance: { type: BowlingPerformanceSchema, required: true },
    fielding_performance: { type: FieldingPerformanceSchema, required: true },
    total_points: { type: PointScoreSchema, required: true },
    match_format: { type: String, required: true },
    player_name: String,
    role: String,
    playerimage: String,
    isSeeded: { type: Boolean, default: false },
    team: String,
});

// Create model for player performance
const PlayerPerformance = mongoose.model('PlayerPerformance', PlayerPerformanceSchema);

module.exports = PlayerPerformance;
