const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const User = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: v => isEmail(v)
  },
  password: String
});

module.exports = mongoose.model('User', User);
