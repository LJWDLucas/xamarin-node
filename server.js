require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');

const server = express();
const database = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
require('mongoose').connect(database, { useNewUrlParser: true });

server.use(express.json({ limit: '500kb' }));
server.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000');
  return next();
});

const passport = require('./authentication/config');

server.use(passport.initialize());

const userRoute = require('./routes/user');
const authenticationRoute = require('./routes/authentication');

server.use('/api/v1', userRoute);
server.use('/api/v1', authenticationRoute);
server.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(res);
  return res.json({ test: 'test' });
});

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, server).listen(3500, () => console.log('studybuddies listening on port 3500!'));
