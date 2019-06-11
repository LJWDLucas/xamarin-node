const authenticationRoute = require('express').Router();
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

authenticationRoute.post('/login', (req, res) => UserModel.findOne({ email: req.body.email })
  .then((doc) => {
    const { email, password, _id: id } = doc;
    if (!id || !req.body.password) {
      return res.json({
        success: false,
        message: 'Email or password is incorrect'
      });
    }
    return argon.verify(password, req.body.password)
      .then((verified) => {
        if (verified) {
          const tokenPayload = {
            email,
            id
          };
          // Use default algoritm HS256
          return jwt.sign(tokenPayload, process.env.SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) {
              return res.json({
                success: false,
                message: 'Something went very wrong.'
              });
            }
            return res.json({
              success: true,
              token: `Bearer ${token}`
            });
          });
        }
        return res.json({
          success: false,
          message: 'Email or password is incorrect'
        });
      });
  })
  .catch(() => {
    res.statusCode = 500;
    return res.json({
      success: false,
      message: 'Internal bzzt error.'
    });
  }));

module.exports = authenticationRoute;
