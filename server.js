const express = require('express');
const server = express();
require('dotenv').config();

const database = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
require('mongoose').connect(database, { useNewUrlParser: true });

server.use(express.json({ limit: '500kb' }));

const userRoute = require('./routes/user');

server.use('/api/v1', userRoute);

server.listen(3500, () => console.log('jStudy listening on port 3005!'))
