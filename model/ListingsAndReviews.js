const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, index: true },
    summary: { type: String, required: true },
    property_type: { type: String },
    room_type: { type: String },
    bed_type: { type: String },
    first_review: { type: Date },
    accommodates: { type: Number },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    beds: { type: Number },
    address: {
        street: { type: String },
    },
    phone: {
        type: String,
        validate: {
            validator: (v) => {
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: [true, 'Phone number required']
    }
});



const ListingsModel = mongoose.model('ListingsAndReviews', ListingSchema, 'ListingsAndReviews');

module.exports = ListingsModel