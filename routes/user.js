const user = require('express').Router();
const model = require('../models/user');

user.get('/users', (req, res) => model.find({})
  .then(docs => res.json({
      success: true,
      results: docs
    })));


module.exports = user;
