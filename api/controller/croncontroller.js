// Example protected route controller
const RecentMatches = require('../models/Matches');
const PlayerStats = require('../models/PlayerStats');
const axios = require('axios');
const fs = require('fs');

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
    seedMatches, seedPlayers, login
};




async function getAllMatchesData() {
    // Set up the API endpoint and headers
    const url = 'https://api.exchange22.com/api/auth/getmatchlist';
    const token = JSON.parse(fs.readFileSync('token.json')).token;

    const headers = {
        'accept-encoding': 'gzip',
        'Authorization': `Bearer ${token}`,
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
    const token = JSON.parse(fs.readFileSync('token.json')).token;

    const headers = {
        "accept-encoding": "gzip",
        'Authorization': `Bearer ${token}`,
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
        const matchesData = await RecentMatches.find({ status: { $ne: "completed" } });

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



async function login() {

    const url = 'https://api.exchange22.com/api/loginuser';
    const headers = {
        'Accept-Encoding': 'gzip',
        'Authorization': 'Bearer',
        'Content-Length': '420',
        'Content-Type': 'application/json',
        'DeviceType': 'ANDROID',
        'Host': 'api.exchange22.com',
        'SportType': '1',
        'User-Agent': 'Dart/3.0 (dart:io)',
    };

    const data = {
        email: null,
        password: 'Madhav@21',
        deviceId: null,
        appid: 'esjBp61cR-WNJUDnm7RRa7:APA91bHy1x5BRzQHsUyuAMo2qmfJe8tEVbDTta1BA92wAwy96JO5iJ2xsqBaQSyl1v32dIROjkCs3Ea73rs5yQwqRKM2rDJc4mC2ik5ZCTQCjWiAG78d8KKFmKylLlioJcBQ3NZ2JoIb',
        type: null,
        social_id: null,
        username: '7988236035',
        image: null,
        idToken: null,
        authorizationCode: null,
        socialLoginType: null,
        name: null,
        referral: null,
        deep_link: null,
        device_type: null,
    };

    try {
        const res = await axios.post(url, data, { headers })
        const token = res.data.data.token;
        const jsonContent = JSON.stringify({ token });

        fs.writeFileSync('token.json', jsonContent);

        return token;
    } catch (error) {
        console.log(error);
    }
}