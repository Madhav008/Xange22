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
    const playerStatsJSON = JSON.stringify(playerStats, null, 2);

    // Write player's stats to a new JSON file
    fs.writeFileSync(`players/${playerName.replace(/\s/g, '_')}_stats.json`, playerStatsJSON);

    console.log(`Stats for ${playerName} have been written to ${playerName.replace(/\s/g, '_')}_stats.json`);
}

// Iterate over each player in the teamPlayers array and write their stats to JSON files
function writeAllPlayersStats(matchData) {
    matchData.teamPlayers.forEach(player => {
        const playerId = player.playerId;
        const playerName = player.name;
        writePlayerStats(matchData, playerId, playerName);
    });
}

module.exports = {
    getPlayerStats,
    writePlayerStats,
    writeAllPlayersStats
};
