const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({ //username, password, phoneNumber, profilePicture
    landlordName: {type: String, required: true},
    placementId: {type: String, required: true, index:true},
    landlordId: {type: String, required: true},
    tenantName: {type: String, required: true},
    tenantId: {type: String, required: true},
    housename: {type: String, required: true},
    houseDescription: { type: Object, required: true},
    comment: {type: String, required: false},
    status: {type: String, required: true}, //pending, approved, cancelled, completed
    date: {type: Date, required: true, index:true},
}, {
    strict: false
// }, {
//     timestamps: true
});

bookingSchema.index({"placementId": 1, "date": 1}, {unique: true});
const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
