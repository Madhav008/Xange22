const { PlayerStats } = require("../models/PlayerStats");

async function getPlayersByMatch(req, res) {
    const { matchkey } = req.body;

    try {
        // First get the match from the matchid
        const players = await PlayerStats.find({
            matchkey: matchkey
        });

        res.status(200).json(players);
    } catch (error) {
        console.error(error);
        // Handle any unexpected errors with a 500 status code
        res.status(500).json({ error: 'Internal Server Error' });
    }
}




module.exports = { getPlayersByMatch };
