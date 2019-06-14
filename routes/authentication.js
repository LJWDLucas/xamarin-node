const authenticationRoute = require('express').Router();
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

authenticationRoute.post('/create', (req, res) => {
  const { email, password } = req.body;
  argon.hash(password, {
    type: argon.argon2id,
    memoryCost: 2 ** 16,
    hashLength: 64,
    timeCost: 8
  })
    .then((hash) => {
      const newUser = new UserModel({ email, password: hash });
      UserModel(newUser).save((err) => {
        if (err) {
          const json = { success: false };
          switch (err.code) {
            case 11000:
              json.message = 'This address is already in use.';
              break;
            default:
              break;
          }
          return res.send(json);
        }
        return res.send({ success: true });
      });
    })
    .catch(() => {
      res.status = 500;
      return res;
    });
});

authenticationRoute.post('/login', (req, res) => UserModel.findOne({ email: req.body.email })
  .then((doc) => {
    const { email, password, _id: id } = doc;
    if (!id || !req.body.password) {
      return res.json({
        success: false,
        payload: 'Email or password is incorrect'
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
                payload: 'Something went very wrong.'
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
          payload: 'Email or password is incorrect'
        });
      });
  })
  .catch(() => {
    res.statusCode = 500;
    return res.json({
      success: false,
      payload: 'Internal bzzt error.'
    });
  }));

module.exports = authenticationRoute;
