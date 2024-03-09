const RecentMatches = require("../models/Matches");
const Performance = require("../models/Performance");
const BattingStats = require("../models/PlayerBattingStats");
const BowlingStats = require("../models/PlayerBowlingStats");
const FieldingStats = require("../models/PlayerFieldingStats");

const SeedPlayerPerformance = async () => {
    console.log("DONE");
};


const PerformanceRoute = async (req, res) => {
    // Handle the protected API route logic
    const { playerId } = req.params;

    await processPlayerMatches(parseInt(playerId, 10));
    const playerPerformanceMatches = await Performance.find({ playerId: playerId }).sort({ date: -1 }).limit(25);
    const result = [];

    // Fetch match names for each performance entry
    for (const performance of playerPerformanceMatches) {
        const match = await RecentMatches.findOne({ matchId: performance.matchId });

        if (match) {
            const matchId = match.matchId;

            // Retrieve batting, bowling, and fielding statistics for the match
            var batStats = await getBatStatsForPlayer(playerId, matchId);
            var bowlStats = await getBowlStatsForPlayer(playerId, matchId);
            var fieldStats = await getFieldStatsForPlayer(playerId, matchId);
            // Handle cases where statistics are null (no data available)
            if (batStats == null) {
                batStats = { points: 0 };
            }

            if (fieldStats == null) {
                fieldStats = { points: 0 };
            }

            if (bowlStats == null) {
                bowlStats = { points: 0 };
            }

            const performanceWithMatchName = {
                ...performance.toObject(),
                bowlStats: bowlStats.points, batStats: batStats.points, fieldStats: fieldStats.points,
                name: match.name,
                teams: match.teams // Add the match name to the performance object
            };
            result.push(performanceWithMatchName);
        }
    }

    res.status(200).json(result);
};

//Get the Last match Performance 

const LatestPerformance = async (playerId) => {
   
}

const processPlayerMatches = async (playerId) => {
    // Initialize variables to track total points, count, and oldPrice

};

module.exports = {
    PerformanceRoute,
    SeedPlayerPerformance,
    LatestPerformance,
    processPlayerMatches
};








const getFieldStatsForPlayer = async (playerId, matchId) => {
    try {
        const FieldStats = await FieldingStats.findOne({ playerId: playerId, matchId: matchId });
        return FieldStats;
    } catch (error) {
        console.log(error);
    }
}

const getBowlStatsForPlayer = async (playerId, matchId) => {
    try {
        const bowlStats = await BowlingStats.findOne({ playerId: playerId, matchId: matchId });
        return bowlStats;
    } catch (error) {
        console.log(error);
    }
}


const getBatStatsForPlayer = async (playerId, matchId) => {
    try {
        const batStats = await BattingStats.findOne({ playerId: playerId, matchId: matchId });
        return batStats;
    } catch (error) {
        console.log(error);
    }
}




