const mongoose = require('mongoose');

//User data while registration.

const user = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePictureUrl: {
        type: String,
        required: true,
    },
});

const User = (module.exports = mongoose.model('User', user));
