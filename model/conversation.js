const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    conversation:{
        type:Array,
        required:true,
        index: true
    },
    message:{
        type:String,
    }},
)
module.exports = mongoose.model('conversation', Schema);