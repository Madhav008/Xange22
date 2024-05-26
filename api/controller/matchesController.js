const RecentMatches = require('../models/Matches');



async function getUpcommingMacthes(req, res) {
    try {
        let query = { };
        if (!req.user?.isAdmin) {
            query.success = false;
        }
        const upcomingMatches = await RecentMatches.find(query);
        res.status(200).json({ ipos: upcomingMatches });
    } catch (error) {
        console.log('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function getMatchDetail(req, res) {
    try {
        let query = { shortForm: req.params.iponame };
        if (!req.user?.isAdmin) {
            query.success = false;
        }
        const upcomingMatches = await RecentMatches.findOne(query);
        res.status(200).json({ data: upcomingMatches });
    } catch (error) {
        console.log('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
    }
}
async function updateMatch(req, res) {
    try {
        // Extracting matchId from the URL parameters and updates from the request body
        const { iponame } = req.params;
        const updates = req.body;

        if (!updates) {
            return res.status(400).json({ error: "Update parameters are required." });
        }

        // Perform the update operation on the document with the specified matchId
        const updateResult = await RecentMatches.updateOne({ _id: iponame }, { $set: updates });

        // Respond with the result of the update operation
        res.status(200).json({ updated: updateResult.nModified });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {getUpcommingMacthes, updateMatch, getMatchDetail}








