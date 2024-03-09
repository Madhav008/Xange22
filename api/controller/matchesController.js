const RecentMatches = require('../models/Matches');


async function getLiveMacthes(req, res) {
    try {
        const liveMatches = await RecentMatches.find({
            status: "started",
        })
        res.status(200).json({ matches: liveMatches });
    } catch (error) {
        console.log('Error occurred:', error.message);
    }
}


async function getUpcommingMacthes(req, res) {

    try {
        const upcomingMatches = await RecentMatches.find({
            status: "notstarted",
        })
        res.status(200).json({ matches: upcomingMatches });
    } catch (error) {
        console.log('Error occurred:', error.message);
    }
}



async function getFinishedMacthes(req, res) {
    try {
        const completedMatches = await RecentMatches.find({
            status: "completed",
        })
        res.status(200).json({ matches: completedMatches });
    } catch (error) {
        console.log('Error occurred:', error.message);
    }
}




module.exports = { getLiveMacthes, getUpcommingMacthes, getFinishedMacthes }








