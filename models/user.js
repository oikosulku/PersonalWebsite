const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'User'
    }
});

// UserSchema.plugin(passportLocalMongoose);
// this adds our UserSchema
// - username field (unique)
// - passwd field (hash)
// - salt field
// + some additional methods
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);