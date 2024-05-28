const Broker = require('../models/Broker');
const RecentMatches = require('../models/Matches');
const User = require('../models/User');

async function getUpcommingMacthes(req, res) {
    try {
        const query = {};
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
        const userid = req.user.id;
        const user = await User.findOne({ "_id":userid });
 
       if(!user) {
            res.status(401).json({ error: 'Unauthorized' });
        }
        const brokerId = user.brokerID;
        console.log(brokerId)
        const broker = await Broker.findOne({ "brokerId":brokerId });
       
        let query = { shortForm: req.params.iponame };
        if (!req.user?.isAdmin) {
            query.success = false;
        }
        const upcomingMatches = await RecentMatches.findOne(query);
        console.log(broker);
        const finaldata ={...upcomingMatches?._doc, ...Object.assign({}, broker?._doc)}
        finaldata._id = upcomingMatches._id
        res.status(200).json({ data: finaldata });
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


async function updatePrice(req, res) {
    try {
        // Extracting matchId from the URL parameters and updates from the request body
        const { iponame } = req.params;
        const { price } = req.body;

        if (!price) {
            return res.status(400).json({ error: "Price is required." });
        }

        // Perform the update operation on the document with the specified matchId
        const updateResult = await RecentMatches.updateOne({ _id: iponame }, { $set: { price: price } });

        // Respond with the result of the update operation
        res.status(200).json({ updated: updateResult.nModified });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
    }
}

async function createMatch(req, res) {
    try {
        const { shortForm, date, seriesId, matchId } = req.body;

        if (!shortForm || !date || !seriesId || !matchId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const newMatch = new RecentMatches({
            shortForm,
            date,
            seriesId,
            matchId,
            success: false
        });

        const savedMatch = await newMatch.save();
        res.status(201).json({ message: 'Match added successfully', match: savedMatch });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: error.message });
    }
}


module.exports = {getUpcommingMacthes, updateMatch, getMatchDetail,createMatch,updatePrice}