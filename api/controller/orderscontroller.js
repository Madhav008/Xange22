const Orders = require("../models/Orders");
const { Wallet, Transaction } = require("../models/Wallet");
const RecentMatches = require('../models/Matches');
const User = require("../models/User");

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
        //Todo: need to add a transaction that player order is created

        // Update the wallet balance
        userWallet.balance -= amount;
        await userWallet.save();

        // Create a new order
        const order = new Orders({
            price, amount, qty, timestamp, status, user, orderType, playerId, matchId, teamId
        });

        // Save the order to the database
        await order.save();

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
            order.profit = profit * order.qty;
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
            //40 60 && 80 60
        } else if (order.price < points && order.price * 2 > points) {
            return points;
        } else {
            return 2 * order.price;
        }
    } else {
        //Order price 40 points 10 profit (40-10)
        if (order.price > points) {
            return 2 * order.price - points;
            //Order price 40 points 
        } else {
            return 0;
        }
    }

};





const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        let orders = await Orders.find({ user: userId }).sort({ timestamp: 1 });
        const uniqueMatchIds = Array.from(new Set(orders.map(order => order.matchId)));
        const matches = {};

        for (const matchId of uniqueMatchIds) {
            await updateOrderProfit(matchId, userId);
            orders = await Orders.find({ user: userId }).sort({ timestamp: 1 });
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



const getMatchOrders = async (req, res) => {
    const { matchId } = req.params;

    try {
        const orders = await Orders.find({ matchId: matchId }).sort({ timestamp: -1 });

        const uniquePlayerIds = new Set();
        const playersData = [];

        for (const order of orders) {
            const playerkey = order.playerId;
            if (!uniquePlayerIds.has(playerkey)) {
                uniquePlayerIds.add(playerkey);

                const playerInfo = await PlayerStats.findOne({ playerkey, matchkey: matchId });

                const playerOrders = orders.filter(o => o.playerId === playerkey);

                playersData.push({
                    playerInfo: playerInfo, // Directly use playerInfo here
                    orders: playerOrders
                });
            }
        }

        res.status(200).json(playersData);
    } catch (error) {
        console.error('Error fetching match orders:', error.message);
        res.status(500).json({ message: "Error fetching match orders", error: error.message });
    }
};


const matchOrderbyUser = async (req, res) => {
    const { matchId } = req.params;

    try {
        let orders = await Orders.find({ matchId: matchId }).sort({ timestamp: -1 });

        const uniqueUserIds = new Set();
        const userData = [];

        for (const order of orders) {
            const userId = order.user;
            if (!uniqueUserIds.has(userId)) {
                uniqueUserIds.add(userId);
                await updateOrderProfit(matchId, userId);
                orders = await Orders.find({ matchId: matchId }).sort({ timestamp: -1 });
                const userInfo = await User.findById(userId);

                const userOrders = orders.filter(o => o.user === userId);

                userData.push({
                    userInfo: userInfo,
                    orders: userOrders
                });
            }
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching match orders:', error.message);
        res.status(500).json({ message: "Error fetching match orders", error: error.message });
    }
};



const getOrders = async (req, res) => {
    try {
        const orders = await Orders.find({}).sort({ timestamp: -1 }); // Fetch all orders
        const uniqueMatchIds = new Set();
        const matches = [];

        for (let order of orders) {
            if (!uniqueMatchIds.has(order.matchId)) {

                const match = await RecentMatches.findOne({ matchkey: order.matchId });
                if (match) {
                    matches.push(match);
                    uniqueMatchIds.add(order.matchId);
                }
            }
        }
        res.status(200).json(matches);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

const updateIsPayout = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Update the specified order to set isPayout to true
        const updatedOrder = await Orders.findByIdAndUpdate(orderId, { isPayout: true }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'isPayout field updated successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};


module.exports = {
    createOrder, getUserOrders, getMatchOrders, getOrders, matchOrderbyUser, updateIsPayout
};


