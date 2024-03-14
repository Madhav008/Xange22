const BattingPoints = require('../models/BattingPoints');
const BowlingPoints = require('../models/BowlingPoints');
const FieldingPoints = require('../models/FieldingPoints');
const PlayerPerformance = require('../models/Performance');

const calculatePlayerPoints = async (playerPerformance) => {
    try {
        let totalPoints = 0;
        // Calculate batting points
        const battingPoints = await calculateBattingPoints(playerPerformance.batting);
        totalPoints += battingPoints;
        // Calculate bowling points
        const bowlingPoints = await calculateBowlingPoints(playerPerformance.bowling);
        totalPoints += bowlingPoints;

        // Calculate fielding points
        const fieldingPoints = await calculateFieldingPoints(playerPerformance.fielding);
        totalPoints += fieldingPoints;

        return totalPoints;
    } catch (error) {
        console.error('Error calculating player points:', error);
        return 0;
    }
};

const calculateBattingPoints = async (battingPerformance) => {
    let totalBattingPoints = 0;

    // Fetch batting points based on the format
    const battingPointsData = await BattingPoints.findOne({ format: battingPerformance?.format });

    // Calculate points for runs, boundaries, and sixes
    totalBattingPoints += (battingPerformance?.bat_runs || 0) * (battingPointsData?.run || 0);
    totalBattingPoints += (battingPerformance?.four_hit || 0) * (battingPointsData?.boundary || 0);
    totalBattingPoints += (battingPerformance?.six_hit || 0) * (battingPointsData?.six || 0);

    // Add bonus points for half-century and century
    if (battingPerformance?.bat_runs >= 50) {
        totalBattingPoints += battingPointsData?.halfCenturyBonus || 0;
    }
    if (battingPerformance?.bat_runs >= 100) {
        totalBattingPoints += battingPointsData?.centuryBonus || 0;
    }

    return totalBattingPoints;
};

const calculateBowlingPoints = async (bowlingPerformance) => {
    let totalBowlingPoints = 0;

    // Fetch bowling points based on the format
    const bowlingPointsData = await BowlingPoints.findOne({ format: bowlingPerformance?.format });

    // Calculate points for wickets
    totalBowlingPoints += (bowlingPerformance?.wicket || 0) * (bowlingPointsData?.wicket || 0);

    // Add bonus points for three, four, and five-wicket hauls
    if (bowlingPerformance?.wicket >= 5) {
        totalBowlingPoints += bowlingPointsData?.fiveWicketHaulBonus || 0;
    } else if (bowlingPerformance?.wicket >= 4) {
        totalBowlingPoints += bowlingPointsData?.fourWicketHaulBonus || 0;
    } else if (bowlingPerformance?.wicket >= 3) {
        totalBowlingPoints += bowlingPointsData?.threeWicketHaulBonus || 0;
    }

    // Calculate points for maiden overs
    totalBowlingPoints += (bowlingPerformance?.maidian_over || 0) * (bowlingPointsData?.maidenOver || 0);

    return totalBowlingPoints;
};


const calculateFieldingPoints = async (fieldingPerformance) => {
    let totalFieldingPoints = 0;

    // Fetch fielding points based on the format
    const fieldingPointsData = await FieldingPoints.findOne({ format: fieldingPerformance?.format });

    // Calculate points for catches, run-outs, and stumpings
    totalFieldingPoints += (fieldingPerformance?.catches || 0) * (fieldingPointsData?.catch || 0);
    totalFieldingPoints += (fieldingPerformance?.runouts || 0) * (fieldingPointsData?.runOutThrower || 0);
    totalFieldingPoints += (fieldingPerformance?.stumping || 0) * (fieldingPointsData?.stumping || 0);

    return totalFieldingPoints;
};




// Function to get player's batting stats
function getPlayerBattingStats(matchData, playerId) {
    return matchData.batting[playerId];
}

// Function to get player's bowling stats
function getPlayerBowlingStats(matchData, playerId) {
    return matchData.bowling[playerId];
}

// Function to get player's fielding stats
function getPlayerFieldingStats(matchData, playerId) {
    return matchData.fielding[playerId];
}

// Function to get player's complete stats
function getPlayerStats(matchData, playerId) {
    const battingStats = getPlayerBattingStats(matchData, playerId);
    const bowlingStats = getPlayerBowlingStats(matchData, playerId);
    const fieldingStats = getPlayerFieldingStats(matchData, playerId);

    return {
        batting: { ...battingStats, format: matchData.format },
        bowling: { ...bowlingStats, format: matchData.format },
        fielding: { ...fieldingStats, format: matchData.format }
    };
}

// Function to write player's stats to a JSON file
function writePlayerStats(matchData, playerId, playerName) {
    const playerStats = getPlayerStats(matchData, playerId);

    // Create JSON string for player's stats
    return calculatePlayerPoints(playerStats);
}

// Iterate over each player in the teamPlayers array, write their stats to JSON files, and collect points
async function parseAllPlayersStats(matchData) {
    let playerStatsArray = [];

    for (const player of matchData.teamPlayers) {
        const playerId = player.playerId;
        const playerName = player.name;
        const playerPoints = await writePlayerStats(matchData, playerId, playerName);
        playerStatsArray.push({ playerId, playerName, points: playerPoints });
    }

    return playerStatsArray;
}

async function getMatchPerformance(req, res) {
    const { matchkey } = req.params;
    console.log(matchkey)
    try {
        const matchPerformance = await PlayerPerformance.find({ match_id: matchkey });
        res.status(200).json({ data: matchPerformance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { parseAllPlayersStats, getMatchPerformance };
