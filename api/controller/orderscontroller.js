const OrderBook = require("../models/OrderBook");
const Orders = require("../models/Orders");
const { Wallet, Transaction } = require("../models/Wallet");
const RecentMatches = require('../models/Matches');
const PlayerStats = require('../models/PlayerStats');
const PlayerPerformance = require("../models/Performance");

const createOrder = async (req, res) => {
    const { price, amount, qty, timestamp, status, user, orderType, playerId, matchId, teamId } = req.body;
    try {
        // Fetch the user's wallet and check its existence
        const userWallet = await Wallet.findOne({ userid: user });
        if (!userWallet) {
            console.log("User's wallet not found")
            return res.status(404).json({ message: "User's wallet not found" });
        }

        // Check if the user has sufficient balance
        if (userWallet.balance < amount) {
            console.log("Insufficient balance to place the order")
            return res.status(400).json({ message: "Insufficient balance to place the order" });
        }

        // Update the wallet balance
        userWallet.balance -= amount;
        await userWallet.save();

        // Create a new order
        const order = new Orders({
            price, amount, qty, timestamp, status, user, orderType, playerId, matchId, teamId
        });

        // Save the order to the database
        await order.save();

        const updateField = orderType === "buy" ? 'buyOrders' : orderType === "sell" ? 'sellOrders' : null;

        if (updateField) {
            try {
                let orderBook = await OrderBook.findOne({ playerId: playerId });

                if (!orderBook) {
                    orderBook = await OrderBook.create({
                        playerId: playerId,
                        buyOrders: [],
                        sellOrders: [],
                    });
                }

                orderBook[updateField].push(order._id);
                await orderBook.save();
            } catch (error) {
                console.log(error)
                return res.status(500).json({ message: "Internal server error", error: error });
            }
        } else {
            console.log("I am here")
            return res.status(400).json({ message: "Invalid orderType" });
        }
        res.status(200).json({ order, updatedWallet: userWallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Order not executed" });
    }
};


const updateOrderProfit = async (matchId, userId) => {
    try {
        // Step 1: Get the orders by matches
        const orders = await Orders.find({ matchId: matchId, user: userId });

        // Step 2: Get the players in the orders
        const playerIds = orders.map(order => order.playerId);
        const uniquePlayerIds = [...new Set(playerIds)];

        // Step 3: Get the points of these players
        const playerPointsMap = {};
        for (const playerId of uniquePlayerIds) {
            const playerStats = await PlayerPerformance.findOne({ player_id: playerId, match_id: matchId });
            if (playerStats) {
                playerPointsMap[playerId] = playerStats.total_points.point;
            }
        }

        // Step 4: Update the profit of these players inside the order
        for (const order of orders) {
            const playerId = order.playerId;
            const points = playerPointsMap[playerId] || 0;
            const profit = calculateProfit(order, points);
            order.profit = profit;
            order.player_point = points;
            await order.save();
        }
        console.log("Order profit updated successfully");
    } catch (error) {
        console.error("Error updating order profit:", error);
    }
};

// Function to calculate profit based on order and player points
const calculateProfit = (order, points) => {

    if (order.orderType == 'buy') {
        if (order.price >= points) {
            return 0;
        } else if (order.price < points && order.price * 2 > points) {
            return points - order.price;
        } else {
            return order.price * 2;
        }
    } else {
        //Order price 40 points 10 profit (40-10)*2
        if (order.price > points) {
            return (order.price - points) * 2;
            //Order price 40 points 
        } else {
            return 0;
        }
    }

};





const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Orders.find({ user: userId }).sort({ timestamp: 1 });
        const uniqueMatchIds = Array.from(new Set(orders.map(order => order.matchId)));
        const matches = {};

        for (const matchId of uniqueMatchIds) {
            await updateOrderProfit(matchId, userId);
            const match = await RecentMatches.findOne({ matchkey: matchId });
            const matchOrders = orders.filter(order => order.matchId === matchId);
            const playersMap = {};

            for (const order of matchOrders) {
                const playerkey = order.playerId;
                const matchkey = order.matchId
                if (!playersMap[playerkey]) {
                    playersMap[playerkey] = {
                        playerInfo: await PlayerStats.findOne({ playerkey, matchkey }),
                        orders: []
                    };
                }

                playersMap[playerkey].orders.push(order);
            }

            const players = Object.values(playersMap);

            matches[matchId] = {
                match,
                players
            };
        }

        const portfolio = Object.values(matches);

        res.status(200).json(portfolio);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error fetching orders" });
    }
};



async function updateWallet(userid, earningOrLoss) {
    try {
        // Fetch the user's wallet
        const userWallet = await Wallet.findOne({ userid: userid });

        // Check if the user's wallet exists
        if (!userWallet) {
            throw new Error("User's wallet not found");
        }

        // Update the wallet balance based on earnings or losses
        userWallet.balance += earningOrLoss;
        await userWallet.save();

        // Create a transaction record
        const depositTransaction = await Transaction.create({
            walletId: userWallet._id,
            transactionId: `txn_${Date.now()}`,
            amount: earningOrLoss,
            type: 'credit',
            description: 'Earned Profit',
            transactionStatus: true, // Set initial status to false
        });
        // Return the updated wallet
        return userWallet;
    } catch (error) {
        // Handle errors here (e.g., log the error or throw a custom error)
        throw new Error(`Failed to update wallet: ${error.message}`);
    }
}
module.exports = {
    createOrder, getUserOrders
};


