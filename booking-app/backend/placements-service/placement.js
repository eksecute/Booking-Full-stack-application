const express = require("express");
const cors = require('cors');
let Placement = require('./placement.model');
const mongoose = require('mongoose');
const crypto = require("crypto");

const app = express();
const port = process.env.port || 5020;

const uri = 'mongodb+srv://admin:admin@houserentappdb-nrzmx.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Service "placement.js" is now connected to MongoDB');
});

app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

//SEARCH
app.get('/search/:form', (req, res) => {
  Placement.find( { housename: { "$regex" : req.params.form, "$options": "i" } } )
      .then(placement => res.json(placement))
      .catch(err => res.status(400).json('Error: ' + err));
});

//GET ALL
app.get('/', (req, res) => {
  Placement.find()
      .then(placement => res.json(placement))
      .catch(err => res.status(400).json('Error: ' + err));
});

//GET BY id
app.get('/:id', (req, res) => {

  let algorithm = "aes-192-cbc";
  let password = "myPassword";
  const key = crypto.scryptSync(password, 'salt', 24);
  let hashedId = req.params.id;

  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedId = decipher.update(hashedId, 'hex', 'utf8') + decipher.final('utf8');

  Placement.find( { landlordId: decryptedId } )
      .then(placement => res.json(placement))
      .catch(err => res.status(400).json('Error: ' + err));
});

// ADD ONE
app.post('/add', (req, res) => {

  const landlordName = req.body.landlordName;
  const landlordId = req.body.landlordId;
  const housename = req.body.housename;
  const description = req.body.description;
  const address = req.body.address;
  const price = Number(req.body.price);
  const file = req.body.file;


  const newPlacement = new Placement({
    landlordName,
    landlordId,
    housename,
    description,
    address,
    price,
    file
  });

  newPlacement.save()
      .then(() => res.json('Accommodation ' + newPlacement.housename + ' added!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

//GET ONE & DELETE ONE
app.get('/single/:id', (req, res) => {
  Placement.findById(req.params.id)
      .then(placement => res.json(placement))
      .catch(err => res.status(400).json('Error: ' + err));
});
app.delete('/single/:id', (req, res) => {
  Placement.findByIdAndDelete(req.params.id)
      .then(() => res.json('Placement "' + req.params.name + '" deleted!'))
      .catch(err => res.status(400).json('Error: ' + err));
});

//UPDATE ONE
app.post('/single/update/:id', (req, res) => {
  Placement.findById(req.params.id)
      .then(placement => { //write found placement to
        placement.landlordName = req.body.landlordName;
        placement.housename = req.body.housename;
        placement.description = req.body.description;
        placement.address = req.body.address;
        placement.price = Number(req.body.price);

        placement.save()
            .then(() => res.json(placement.housename + ' updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
      }).catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Service placement.js is now running on ${port}..`);
});
