const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./user.model');

passport.serializeUser(function(user, done) {
  console.log("serialisation: ", user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log("DEserialisation: ", id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(
        username,
        password,
        done
    ) {
      User.findOne({ username: username })
          .then(user => {
            if (user !== null) {
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw (err);
                if (isMatch) {
                  return done(null, user);
                } else {
                  return done(null, false, { message: "Wrong password!" })
                }
              })
                  .catch(err => {
                    return done(null, false, { message: err })
                  })
            } else {
              return done(null, false, { message: "Wrong username!" })
            }
          })
    }
));
