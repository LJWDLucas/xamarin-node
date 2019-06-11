const userRoute = require('express').Router();
const argon = require('argon2');
const UserModel = require('../models/user');

userRoute.post('/user/create', (req, res) => {
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

userRoute.get('/users', (req, res) => UserModel.find({})
  .then(docs => res.json({
    success: true,
    result: docs
  })));

userRoute.get('/user/:id', (req, res) => UserModel.find({ _id: req.params.id })
  .then(doc => res.json({
    success: true,
    result: doc
  })));

module.exports = userRoute;
