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
    transactions: [String]
});



const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Wallet, Transaction };