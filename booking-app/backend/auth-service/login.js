const router = require ('express').Router();
const passport = require('passport');

router.post('/', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return res.status(400).json( { errors: err });
    }
    if (!user) {
      // return res.send('Укажите правильный email или пароль!');
      return res.status(400).json( { errors: 'Wrong username or password!' });
    }
    req.logIn(user, function(err) {
      if (err) {
        // return next(err);
        return res.status(400).json( { errors: err });
      }
      // return res.redirect('/granted');
      return res.status(200).json( { success: 'Logged in ' + user.id});
    });
  })(req, res, next);
});

module.exports = router;
