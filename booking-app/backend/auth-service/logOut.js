const router = require ('express').Router();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

router.get('/', function(req, res){
  req.logout();
  res.redirect('http://localhost:3000/login');
});


module.exports = router;
