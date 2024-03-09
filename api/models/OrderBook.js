const mongoose = require('mongoose');

const orderBookSchema = new mongoose.Schema({
  playerId:String,
  buyOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders'
    }
  ],
  sellOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Orders'
    }
  ]
});

const OrderBook = mongoose.model('OrderBook', orderBookSchema);

module.exports = OrderBook;
