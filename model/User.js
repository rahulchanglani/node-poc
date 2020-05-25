const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    hashed_password: { type: String, default: '' },
    salt: { type: String, default: '' },
    batch: { type: String,  enum: ['A', 'B'], default: 'A'}
});

mongoose.model('User', UserSchema, 'User');