// Example protected route controller
const RecentMatches = require('../models/Matches');
const PlayerStats = require('../models/PlayerStats');

const axios = require('axios');
const seedMatches = async (req, res) => {
    try {
        const matchesData = await getAllMatchesData();

        for (const match of matchesData.data) {
            // Check if the match already exists by matchkey
            const existingMatch = await RecentMatches.findOne({ matchkey: match.matchkey });

            if (!existingMatch) {
                // If match doesn't exist, seed the match
                const newMatch = new RecentMatches(match);
                await newMatch.save();
            } else {
                // If match already exists, update the existing match
                await RecentMatches.findOneAndUpdate({ matchkey: match.matchkey }, match);
            }
        }

        res.json({ message: 'SEEDED ALL THE MATCHES' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



const seedPlayers = async (req, res) => {
    // Handle the protected API route logic
    await runAndStoreData();
    res.json({ message: "SEEDED ALL THE PLAYERS" });
};

module.exports = {
    seedMatches, seedPlayers
};




async function getAllMatchesData() {
    // Set up the API endpoint and headers
    const url = 'https://api.exchange22.com/api/auth/getmatchlist';
    const headers = {
        'accept-encoding': 'gzip',
        'authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VpZCI6ImE2YTJmYzA3LWUyY2YtNDc4OC1iYzQ3LWJkNWI1OTY1ZWMwZTEyNjEwNjIxNzA5NDcxMjM1IiwiZXhwIjoxNzEyMTcxMjM1LCJpZCI6MTI2MTA2MiwibmFtZSI6Im1hZGhhdmoyMTFAZ21haWwuY29tIn0.5kscrzEpTCzm97uX7iwPKQzS0TkIzUf_ukszq63Gpwg',
        'content-type': 'application/json',
        'devicetype': 'ANDROID',
        'host': 'api.exchange22.com',
        'sporttype': '1',
        'user-agent': 'Dart/3.0 (dart:io)',
    };

    try {
        // Make a GET request to get all matches
        const response = await axios.get(url, { headers });

        // Check if the request was successful (status code 200)
        if (response.status === 200) {
            return response.data;
        } else {
            console.log(`Error: Unable to fetch matches data. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
    }
}


// Function to get all players
async function getPlayersData(matchkey) {
    const url = "https://api.exchange22.com/api/auth/getallplayers";
    const headers = {
        "accept-encoding": "gzip",
        "authorization": "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3VpZCI6ImE2YTJmYzA3LWUyY2YtNDc4OC1iYzQ3LWJkNWI1OTY1ZWMwZTEyNjEwNjIxNzA5NDcxMjM1IiwiZXhwIjoxNzEyMTcxMjM1LCJpZCI6MTI2MTA2MiwibmFtZSI6Im1hZGhhdmoyMTFAZ21haWwuY29tIn0.5kscrzEpTCzm97uX7iwPKQzS0TkIzUf_ukszq63Gpwg",
        "content-type": "application/json",
        "devicetype": "ANDROID",
        "host": "api.exchange22.com",
        "sporttype": "1",
        "user-agent": "Dart/3.0 (dart:io)",
    };

    const params = {
        "matchkey": matchkey,
        "is_premium": "0",
        "players_request_trade_type": "buysell",
    };

    try {
        const response = await axios.get(url, { headers, params });

        if (response.status === 200) {
            return response.data;
        } else {
            console.log(`Error: Unable to fetch players data. Status code: ${response.status}`);
            return null;
        }

    } catch (error) {
        console.log(`An error occurred while fetching players data: ${error.message}`);
        return null;
    }
}

// Function to run and store data
async function runAndStoreData() {
    try {
        const matchesData = await RecentMatches.find({});

        for (const match of matchesData || []) {
            const matchId = match.matchkey;

            // if (matchId && match.status === "notstarted") {
            if (matchId) {
                // Get players data
                const playersData = await getPlayersData(matchId);
                if (playersData && playersData.data) {
                    // Store or update players data in MongoDB
                    for (const player of playersData.data) {
                        const existingPlayer = await PlayerStats.findOneAndUpdate(
                            { matchkey: matchId, playerkey: player.playerkey },
                            { $set: player },
                            { upsert: true, new: true }
                        );

                        // Log the updated or newly created player
                        console.log(existingPlayer);
                    }
                }
            }
        }

        console.log("Data stored in MongoDB at", new Date().toISOString());
    } catch (error) {
        console.error(`An error occurred while fetching and storing data: ${error.message}`);
    }
}



