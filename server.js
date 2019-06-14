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

const usersRoute = require('./routes/user');
const authenticationRoute = require('./routes/authentication');
const assignmentsRoute = require('./routes/assignments');
const deliverablesRoute = require('./routes/deliverables');

const apiVersion = '/api/v1';
const authenticate = passport.authenticate('jwt', { session: false });

server.use(apiVersion, authenticate, assignmentsRoute);
server.use(apiVersion, authenticate, usersRoute);
server.use(apiVersion, authenticate, deliverablesRoute);
server.use('/auth', authenticationRoute);

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, server).listen(3500, () => console.log('studybuddies listening on port 3500!'));
