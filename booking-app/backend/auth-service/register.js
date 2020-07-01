const router = require ('express').Router();
const User = require('./user.model');
const bcrypt = require('bcrypt');

router.route('/').post((req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const newUser = new User({ username, password });

  bcrypt.genSalt(5, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      newUser.password = hash;
      newUser
          .save()
          .then(() => res.json('User added!'))
          .catch(err => res.status(400).json('Error!!!: ' + err));
    });
  });
});

module.exports = router;
