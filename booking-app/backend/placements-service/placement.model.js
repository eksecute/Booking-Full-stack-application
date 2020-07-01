const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placementSchema = new Schema({ //username, password, phoneNumber, profilePicture

    landlordName: {type: String, required: true},
    landlordId: {type: String, required: true},
    housename: {type: String, required: true},
    description: {type: String, required: true},
    address: {type: String, required: true},
    price: {type: Number, required: true}
}, {
    timestamps: true
});

const Placement = mongoose.model('accommodations', placementSchema);

module.exports = Placement;
