const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders');
const { Wallet } = require('../models/Wallet');
const { protect } = require('../midleware/authmiddlware');

// Update the order status
async function updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    try {
        const updatedOrder = await Orders.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create a buy order
async function updateWalletBalance(wallet, totalAmount, type) {
    wallet.balance -= totalAmount;
    await wallet.save();
}

async function createBuyOrder(req, res) {
    const { userId, stockId, quantity, price } = req.body;
    try {
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const totalAmount = price * quantity;
        if (totalAmount > wallet.balance) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        await updateWalletBalance(wallet, totalAmount, 'Buy');

        const order = new Orders({
            userId,
            stockId,
            orderType: 'Buy',
            quantity,
            price,
            status: 'Pending'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function createSellOrder(req, res) {
    const { userId, stockId, quantity, price } = req.body;
    try {
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found' });
        }
        const totalAmount = price * quantity;

        await updateWalletBalance(wallet, totalAmount, 'Sell');

        const order = new Orders({
            userId,
            stockId,
            orderType: 'Sell',
            quantity,
            price,
            status: 'Pending'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

router.put('/:orderId',protect, updateOrderStatus);
router.post('/buy', protect,createBuyOrder);
router.post('/sell',protect, createSellOrder);

module.exports = router;

