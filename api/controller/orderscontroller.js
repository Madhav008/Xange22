const OrderBook = require("../models/OrderBook");
const Orders = require("../models/Orders");
const { Wallet } = require("../models/Wallet");
const RecentMatches = require('../models/Matches');
const PlayerStats = require('../models/PlayerStats')

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





const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Orders.find({ user: userId });
        const uniqueMatchIds = Array.from(new Set(orders.map(order => order.matchId)));
        const matches = {};

        for (const matchId of uniqueMatchIds) {
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




const closeOrder = async (req, res) => {
    const { orderId, walletId, currentPrice } = req.body;

    try {
        // Find the order to be closed
        const order = await Orders.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the corresponding order book ID
        const orderBookId = "650e99b298038f94a5da077d"; // Use the actual order book ID

        // Remove the order from the order book
        const orderBook = await OrderBook.findByIdAndUpdate(
            orderBookId,
            { $pull: { buyOrders: orderId, sellOrders: orderId } },
            { new: true }
        );

        // Calculate earnings or losses
        const earningOrLoss = calculateEarningOrLoss(order, currentPrice);

        // Update the user's wallet based on the earnings or losses
        const updatedWallet = await updateWallet(walletId, earningOrLoss);

        // Update the order status to "Close"
        order.orderStatus = "Close";
        await order.save();

        res.status(200).json({ message: 'Order closed successfully', earningOrLoss, updatedWallet });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Failed to close order' });
    }
};
function calculateEarningOrLoss(order, currentPrice) {
    // Implement your logic to calculate earnings or losses based on the order details
    // For example, you can calculate it using the difference between the current price and the order price
    // Replace this logic with your actual calculation
    // const currentPrice =  /* Fetch the current price */;


    const earningOrLoss = (currentPrice - parseFloat(order.price).toFixed(2)) * order.qty;

    return earningOrLoss + currentPrice * order.qty;
}
async function updateWallet(walletId, earningOrLoss) {
    try {
        // Fetch the user's wallet
        const userWallet = await Wallet.findById(walletId);

        // Check if the user's wallet exists
        if (!userWallet) {
            throw new Error("User's wallet not found");
        }

        // Update the wallet balance based on earnings or losses
        userWallet.balance += earningOrLoss;
        await userWallet.save();

        // Return the updated wallet
        return userWallet;
    } catch (error) {
        // Handle errors here (e.g., log the error or throw a custom error)
        throw new Error(`Failed to update wallet: ${error.message}`);
    }
}
module.exports = {
    createOrder, getUserOrders, closeOrder
};


