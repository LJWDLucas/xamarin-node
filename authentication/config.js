const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const userModel = require('../models/user');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

passport.use(new Strategy(opts, (payload, done) => {
  console.log('hello')
  userModel.findOne({ _id: payload.sub }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));

module.exports = passport;
