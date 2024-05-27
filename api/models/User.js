const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  displayName:{
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  image: {
    type: String,
  },
  password: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isBroker:{
    type:Boolean,
    default:false,
  },
  brokerID: {
    type: String,
    default: null,
  },
  role: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
