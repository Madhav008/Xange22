const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');
const { Wallet } = require('../models/Wallet');
const { protect } = require('../midleware/authmiddlware');
const User = require('../models/User');
const RecentMatches = require('../models/Matches');

// Update the order status
async function updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const order = await Orders.findById(orderId);
        if(status === 'Cancelled') {
            const stock = await RecentMatches.findById(order.stockId);
            const closedPrice = stock.price;
            const updatedOrder = await Orders.findByIdAndUpdate(
                orderId,
                { status, closedPrice },
                { new: true }
            );
        } else {
            const updatedOrder = await Orders.findByIdAndUpdate(
                orderId,
                { status },
                { new: true }
            );
        }
        res.status(200).json({"message":`Order status updated successfully`});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a buy order

async function createBuyOrder(req, res) {
    const { stockId, quantity, price } = req.body;
    try {
        const userId = req.user.id;
        //find the user from the userId
        const user = await User.findOne({ "_id":userId });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const brokerId = user.brokerID;

        const wallet = await Wallet.findOne({ "userid":userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const totalAmount = price * quantity;
        if (totalAmount > wallet.balance) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        await Wallet.updateOne({ userid: userId }, { $inc: { balance: -totalAmount } });

        const order = new Orders({
            userId,
            stockId,
            brokerId,
            orderType: 'Buy',
            quantity,
            priceAtOrder: price,
            orderDate : Date.now(),
            commissionPaid:10,
            status: 'Pending'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
}

async function createSellOrder(req, res) {
    const {  stockId, quantity, price } = req.body;
    try {
        const userId = req.user.id;

        //find the user from the userId
        const user = await User.findOne({ "_id":userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const brokerId = user.brokerID;

        const wallet = await Wallet.findOne({ "userid":userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const totalAmount = price * quantity;

        await Wallet.updateOne({ userid: userId }, { $inc: { balance: -totalAmount } });

        const order = new Orders({
            userId,
            stockId,
            brokerId,
            orderType: 'Sell',
            quantity,
            priceAtOrder: price,
            orderDate : Date.now(),
            commissionPaid:10,
            status: 'Pending'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserOrders(req, res) {
    try {
        const userId = req.user.id;
        const query = {
            status: { $in: ['Pending', 'Completed'] }
        }
        const orders = await Orders.find({ userId, ...query });
        const ordersWithStockDetail = await Promise.all(orders.map(async (order) => {
            const stock = await RecentMatches.findById(order.stockId);
            return {
                orderId: order._id,
                quantity: order.quantity,
                priceAtOrder: order.priceAtOrder,
                orderType: order.orderType,
                orderDate: order.orderDate,
                commissionPaid: order.commissionPaid,
                status: order.status,
                ...stock?._doc
            };
        }));
        res.status(200).json({ orders: ordersWithStockDetail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getBrokerOrders(req,res){
    try {
        const brokerId = req.params.brokerId;
        const orders = await Orders.find({ brokerId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getClosedOrders(req, res) {
    try {
        const userId = req.user.id;
        const query = {
            status: { $in: ['Cancelled'] }
        }
        const orders = await Orders.find({ userId, ...query }).sort({ updatedAt: -1 });
        const ordersWithStockDetail = await Promise.all(orders.map(async (order) => {
            const stock = await RecentMatches.findById(order.stockId);
            return {
                orderId: order._id,
                quantity: order.quantity,
                priceAtOrder: order.priceAtOrder,
                orderType: order.orderType,
                orderDate: order.orderDate,
                closedPrice : order.closedPrice,
                commissionPaid: order.commissionPaid,
                status: order.status,
                ...stock?._doc
            };
        }));
        res.status(200).json({ orders: ordersWithStockDetail });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


router.put('/:orderId',protect, updateOrderStatus);
router.post('/buy', protect,createBuyOrder);
router.post('/sell',protect, createSellOrder);
router.get('/user', protect, getUserOrders);
router.get('/user/history', protect, getClosedOrders);
router.get('/broker/:brokerId', protect, getBrokerOrders);


module.exports = router;

