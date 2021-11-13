const mongoose = require('mongoose');

const adminSchemma = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const admin = (module.exports = mongoose.model('Admin', adminSchemma));
