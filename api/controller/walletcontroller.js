// Import the necessary models and modules
const User = require('../models/User');
const { Wallet, Transaction } = require('../models/Wallet');


const createWalletHelper = async (userid) => {
    // Check if the wallet already exists for the user
    const existingWallet = await Wallet.findOne({ userid: userid });
    if (existingWallet) {
        return;
    } else {
        // Create a new wallet
        const newWallet = await Wallet.create({ userid });
        return newWallet
    }

}

// Controller function to create a wallet
const createwallet = async (req, res) => {
    try {
        // Extract user ID from request body or headers based on your authentication
        const { userid } = req.body;

        // Validate that userid is provided
        if (!userid) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Check if the wallet already exists for the user
        const existingWallet = await Wallet.findOne({ userid });

        if (existingWallet) {
            return res.status(400).json({ error: 'Wallet already exists for the user.' });
        }

        // Create a new wallet
        const newWallet = await Wallet.create({ userid });

        res.status(201).json({ newWallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to get wallet balance
const getwallet = async (req, res) => {
    try {
        // Extract user ID from request body or headers based on your authentication
        const userid  = req.user.id;
        console.log(userid);
        // Validate that userid is provided
        if (!userid) {
            return res.status(400).json({ error: 'User ID is required.' });
        }

        // Find the wallet for the specified user
        const userWallet = await Wallet.findOne({ userid });

        if (!userWallet) {
            return res.status(404).json({ error: 'Wallet not found for the user.' });
        }

        res.status(200).json({ balance: userWallet.balance, wallet: userWallet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to deposit funds
const deposit = async (req, res) => {
    try {
        const { userid, amount } = req.body;
        const isBroker = req.user.isBroker;

        if (!isBroker) {
            return res.status(400).json({ error: 'Only Brokers can deposit funds' });
        }

        if (!userid || !amount) {
            return res.status(400).json({ error: 'User ID and amount are required.' });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }

        const userWallet = await Wallet.findOne({ userid });
        if (!userWallet) {
            return res.status(404).json({ error: 'Wallet not found for the user.' });
        }

        const roundedAmount = parseFloat(parsedAmount.toFixed(2));

        userWallet.balance += roundedAmount;
        await userWallet.save();

        const depositTransaction = await Transaction.create({
            walletId: userid,
            amount: roundedAmount,
            type: 'credit',
            description: 'Deposit',
            transactionStatus: false, // Set initial status to false
        });

        return res.status(200).json({ balance: userWallet.balance, depositTransaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to withdraw funds
const withdraw = async (req, res) => {
    try {
        // Extract user ID and amount from request body
        const { userid, amount } = req.body;

        // Validate that userid and amount are provided
        if (!userid || !amount) {
            return res.status(400).json({ error: 'User ID and amount are required.' });
        }

        // Check if the amount is a positive number
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number.' });
        }

        // Find the wallet for the specified user
        const userWallet = await Wallet.findOne({ userid });

        if (!userWallet) {
            return res.status(404).json({ error: 'Wallet not found for the user.' });
        }

        // Check if the user has sufficient balance
        if (userWallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance.' });
        }

        // Round the amount to two decimal places
        const roundedAmount = parseFloat(parsedAmount.toFixed(2));

        // Update the balance in the wallet
        userWallet.balance -= roundedAmount;
        await userWallet.save();

        // Create a transaction record
        const withdrawTransaction = await Transaction.create({
            walletId: userWallet._id,
            transactionId: `txn_${Date.now()}`,
            amount: roundedAmount,
            type: 'debit',
            description: 'Withdrawal',
            transactionStatus: false, // Set initial status to false
        });

        res.status(200).json({ balance: userWallet.balance, withdrawTransaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller function to get transactions for a single user
const getUserTransactions = async (req, res) => {
    try {
        const walletId  = req.user.id;
        // Validate that walletId is provided
        if (!walletId) {
            return res.status(400).json({ error: 'Wallet ID is required.' });
        }
        // Find transactions for the specified user
        const userTransactions = await Transaction.find({ walletId: walletId })
            .sort({ createdAt: -1 }); // Sort by createdAt in descending order
        res.status(200).json({ userTransactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getBrokerTransactions = async (req, res) => {
    try {
        //Get the broker id and then  and then get the transactions of all those users
        const brokerId = req.user._id;

        // Validate that brokerId is provided
        if (!brokerId) {
            return res.status(400).json({ error: 'Broker ID is required.' });
        }

        // search the users who have the same brokerId
        const users = await User.find({ brokerID: brokerId });

        const userWallets = await Wallet.find({ userid: { $in: users.map(user => user._id) } });
        
        const transactions = await Transaction.find({ walletId: { $in: userWallets.map(wallet => wallet.userid) } });


        res.status(200).json({ transactions });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to update a transaction by the admin
const getPendingDeposits = async (req, res) => {
    try {
        // Fetch pending deposit transactions (where transactionStatus is false)
        const pendingDeposits = await Transaction.find({ type: 'credit', transactionStatus: false });

        res.status(200).json({ pendingDeposits });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// Controller function to get pending withdrawal requests for the admin
const getPendingWithdrawals = async (req, res) => {
    try {
        // Fetch pending withdrawal transactions (where transactionStatus is false)
        const pendingWithdrawals = await Transaction.find({ type: 'debit', transactionStatus: false });

        res.status(200).json({ pendingWithdrawals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const updateWallet = async (req, res) => {
    const { userId, earningOrLoss } = req.body
    try {
        // Fetch the user's wallet
        const userWallet = await Wallet.findOne({ userid: userId });

        // Check if the user's wallet exists
        if (!userWallet) {
            throw new Error("User's wallet not found");
        }

        // Update the wallet balance based on earnings or losses
        userWallet.balance += earningOrLoss;
        await userWallet.save();

        try {
            // Create a transaction record
            const depositTransaction = await Transaction.create({
                walletId: userWallet._id,
                transactionId: `txn_${Date.now()}`,
                amount: earningOrLoss,
                type: 'credit',
                description: 'Earned Profit',
                transactionStatus: true, // Set initial status to false
            });
        } catch (error) {
            console.log(error)
        }
        // Return the updated wallet
        return userWallet;
    } catch (error) {
        // Handle errors here (e.g., log the error or throw a custom error)
        console.log(error)
        throw new Error(`Failed to update wallet: ${error.message}`);
    }
}
module.exports = {
    createWalletHelper,
    createwallet,
    getwallet,
    withdraw,
    deposit,
    getUserTransactions,
    getBrokerTransactions,
    getPendingDeposits,
    getPendingWithdrawals, updateWallet
};
