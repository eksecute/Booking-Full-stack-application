const express = require('express');
const gateway = require('fast-gateway');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo")(session);
const cors = require('cors');

const port = process.env.port || 8080;

const uri = 'mongodb+srv://admin:admin@houserentappdb-nrzmx.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
    .catch((err) => console.log(err));
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Api-gateway is now connected to MongoDB');
});

let whitelist = [
  'http://localhost:3000', //client
  'http://localhost:8080', //gateway
  'http://localhost:5010', //auth-service
  'http://localhost:5020', //placements-service
  'http://localhost:5030'  //bookings-service
];
const server = gateway({
  withCredentials: true,
  middlewares: [
    express.json(),
    express.urlencoded({ extended: true }),
    cors({
      credentials: true,
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) { callback(null, true) }
        else { callback(new Error('Not allowed by CORS')) }
      }
    }),
    session({
      secret: 'mySecret',
      store: new MongoStore({
        mongooseConnection: connection,
        collection: 'sessions'
      }),
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: true
    }),
  ],
  routes: [
    {
      prefix: '/auth',
      target: 'http://localhost:5010/',
      withCredentials: true,
    },
    {
      prefix: '/placement',
      target: 'http://localhost:5020/'
    },
    {
      prefix: '/booking',
      target: 'http://localhost:5030/'
    }
  ],
});

server.start(port).then(() => {
  console.log(`Api-gateway is now running on ${port}..`);
});









