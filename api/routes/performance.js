const express = require('express');
const router = express.Router();
const { getMatchData } = require('../../espn_api/CronRecentData');
const performanceController = require('../controller/performanceController');
const { protect } = require('../midleware/authmiddlware');

// Example protected API route
// router.get('/players', apiController.SeedPlayerPerformance);
// router.get('/:playerId', apiController.PerformanceRoute);
router.get('/match/:matchkey', protect, performanceController.getMatchPerformance);

// Route to calculate player points
router.get('/calculate', async (req, res) => {
    try {
        // const { espn_seriesId, espn_matchId, matchId } = req.body; // Assuming the player performance data is sent in the request body


        // Call getMatchData function and store the result in a variable
        const matchdata = await getMatchData(1411373, 1417734);

        // // Convert the data to JSON format
        // const jsonData = JSON.stringify(data, null, 2);

        // fs.writeFileSync('match_data.json', jsonData);
        /*     const playerPerformance = {
                "batting": {
                    "playerId": 1212830,
                    "matchId": "1417734",
                    "bat_runs": 36,
                    "balls_faced": 28,
                    "six_hit": 2,
                    "four_hit": 4,
                    "is_bat": true,
                    "is_out": false,
                    "hundred": 0,
                    "fifty": 0,
                    "format": "T20"
                },
                "bowling": {
                    "format": "T20"
                },
                "fielding": {
                    "playerId": 1212830,
                    "matchId": "1417734",
                    "catches": 0,
                    "runouts": 0,
                    "stumping": 1,
                    "format": "T20"
                }
            } */

        const totalPoints = await performanceController.parseAllPlayersStats(matchdata);

        res.json({ totalPoints });
    } catch (error) {
        console.error('Error calculating player points:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;


