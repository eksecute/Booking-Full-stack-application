const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require("connect-mongo")(session);
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');
const crypto = require("crypto");
let User = require('./user.model');

const app = express();
const port = process.env.port || 5010;

const uri = 'mongodb+srv://admin:admin@houserentappdb-nrzmx.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Service "auth.js" is now connected to MongoDB');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
//session params.
app.use(session({
      secret: 'mySecret',
      store: new MongoStore({
        mongooseConnection: connection,
        collection: 'sessions'
      }),
      cookie: { maxAge: 60 * 60 * 1000 },
      resave: false,
      saveUninitialized: true
    }));
//passport middleware
require('./config-passport');
app.use(passport.initialize());
app.use(passport.session());
// ROUTES
const registerRoute = require('./register');
const loginRoute    = require('./login');
const logOutRoute   = require('./logOut');
//
app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', logOutRoute);

function authCurrent(req, res, next) {
  if (req.session.passport === undefined) {
    return res.status(401).send("You haven't logged in");
  } else {
    User.findById(req.session.passport.user, function (err, user) {
      if (user == undefined) {
        return res.status(401).send("You haven't logged in");
      }
      if (req.session.passport.user != user._id) {
        return res.status(401).send('Access denied!');
      }
      else {
        next()
      }
    });
  }
}

app.get('/getUserId/encrypted', authCurrent, (req, res) => {
  //encrypting
  let algorithm = "aes-192-cbc";
  let password = "myPassword";
  const key = crypto.scryptSync(password, 'salt', 24);
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let userId = req.session.passport.user;

  let encryptedId = cipher.update(userId, 'utf8', 'hex') + cipher.final('hex'); // encrypted text

  res.json(encryptedId);
});

app.get('/getUser', authCurrent, (req, res) => {
  User.findById(req.session.passport.user)
        .then(user => res.json(user))
        .catch(err => res.status(400).send(err))
});

app.post('/edit', authCurrent, (req, res) => {
      User.findById(req.session.passport.user)
          .then( user => {
            user.username = req.body.username;
            user.password = req.body.password;

            bcrypt.genSalt(5, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                user.save()
                    .then(() => res.json(user.username + ' updated!'))
                    .catch(err => res.status(400).json('Error: ' + err));
              })
            });
          }).catch((err) => console.log(err));
});

app.delete('/delete/:id', (req, res) => {
  User.findByIdAndDelete(req.params.id)
      .then(() => res.json('User "' + req.params.name + '" deleted!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

app.get('/', authCurrent, (req, res) => {
  res.send(200);
});

app.listen(port, () => console.log(`Service "auth.js" is now running on ${port}..`));
