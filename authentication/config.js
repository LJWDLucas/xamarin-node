const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
};

passport.use(new Strategy(opts, (payload, done) => {
  if (payload.id) {
    return done(null, payload);
  }
  return done(null, false);
}));

module.exports = passport;
