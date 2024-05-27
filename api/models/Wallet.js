const mongoose = require('mongoose');

// Wallet Schema
const WalletSchema = new mongoose.Schema({
    userid: {
        type: String,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Wallet = mongoose.model('Wallet', WalletSchema);

// Transaction Schema
const TransactionSchema = new mongoose.Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    transactionId: {
        type: String,
        unique: true
    },
    amount: Number,
    type: {
        type: String,
        enum: ['credit', 'debit']
    },
    description: String,
    transactionStatus: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Wallet, Transaction };