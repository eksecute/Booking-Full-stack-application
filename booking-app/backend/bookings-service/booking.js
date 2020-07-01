const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require("crypto");
let Booking = require('./booking.model');

const app = express();
const port = process.env.port || 5030;

app.use(cors());
app.use(express.json());

const uri = 'mongodb+srv://admin:admin@houserentappdb-nrzmx.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Service "booking.js" is now connected to MongoDB');
});

app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());

//hashing params
let algorithm = "aes-192-cbc";
let password = "myPassword";
const key = crypto.scryptSync(password, 'salt', 24);
const iv = Buffer.alloc(16, 0);

//add one
app.post('/add', (req, res) => {

  const houseDescription = req.body.houseDescription;
  const landlordName     = req.body.landlordName;
  const placementId      = req.body.placementId;
  const landlordId       = req.body.landlordId;
  const tenantName       = req.body.tenantName;
  const housename        = req.body.housename;
  const tenantId         = req.body.tenantId;
  const comment          = req.body.comment;
  const status           = req.body.status;
  const date             = req.body.date;

  const newBooking = new Booking({
    houseDescription,
    landlordName,
    placementId,
    landlordId,
    tenantName,
    housename,
    tenantId,
    comment,
    status, //pending, approved, cancelled, completed
    date
  });

  newBooking.save()
      .then(() => res.json('Booking for ' + newBooking.housename + ' added!'))
      .catch(err => {
        console.log(err);
        res.status(400).json('Error: ' + err)
      });
});

//get & delete
app.get('/single/:id', (req, res) => {
  Booking.findById(req.params.id)
      .then(booking => res.json(booking))
      .catch(err => res.status(400).json('Error: ' + err));
});
app.delete('/single/:id', (req, res) => {
  Booking.findByIdAndDelete(req.params.id)
      .then(() => {
        res.json('Booking ' + req.params.name + ' deleted!')
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

//update one
app.post('/single/update/:id', (req, res) => {
  Booking.findById(req.params.id)
      .then(booking => {

        booking.houseDescription = req.body.houseDescription;
        booking.landlordName     = req.body.landlordName;
        booking.placementId      = req.body.placementId;
        booking.landlordId       = req.body.landlordId;
        booking.tenantName       = req.body.tenantName;
        booking.housename        = req.body.housename;
        booking.tenantId         = req.body.tenantId;
        booking.comment          = req.body.comment;
        booking.status           = req.body.status;
        booking.date             = req.body.date;

        booking.save()
            .then(() => res.json('"' + booking.housename + '" updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
      }).catch(err => res.status(400).json('Error: ' + err));
});

//update status
app.post('/single/update/status/:id', (req, res) => {
  Booking.updateOne(
      { "_id" : req.params.id },
      { $set: { "status" : req.body.status } })
      .then(res.send("Updated!"))
      .catch((err) => console.log(err));
});

//get all tenant
app.get('/getAllBookings/tenant/:id', (req, res) => {

  let hashedId = req.params.id;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedId = decipher.update(hashedId, 'hex', 'utf8') + decipher.final('utf8');

  Booking.find({ tenantId: decryptedId })
    .then(booking => res.json(booking))
    .catch(err => {
      console.log(err);
      res.status(400).json('Errorr: ' + err);
    });
});

//get all landlords
app.get('/getAllBookings/landlord/:id', (req, res) => {

  let hashedId = req.params.id;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedId = decipher.update(hashedId, 'hex', 'utf8') + decipher.final('utf8');

  Booking.find({ landlordId: decryptedId })
      .then(booking => res.json(booking))
      .catch(err => {
        console.log(err);
        res.status(400).json('Errorr: ' + err);
      });
});

app.listen(port, () => {
  console.log(`Service booking.js is now running on ${port}..`);
});
