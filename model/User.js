const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    FullName:{
        type:String,
        required:true,
    },
    Email: {
        type: String,
        required: true,
        unique: true,
    },
    Password: {
        type: String,
        required: true,
    },
    About: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        required: false,
    },
    Status: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model('User', Schema);
