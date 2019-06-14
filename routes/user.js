const userRoute = require('express').Router();
const UserModel = require('../models/user');

userRoute.get('/users', (req, res) => UserModel.find({})
  .then(docs => res.json({
    success: true,
    payload: docs
  })));

userRoute.get('/user/:id', (req, res) => UserModel.find({ _id: req.params.id })
  .then(doc => res.json({
    success: true,
    payload: doc
  })));

module.exports = userRoute;
