const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
  },
  displayName: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: String,
  },
  password: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
