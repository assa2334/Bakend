const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    conversation:{
        type:Array,
        required:true,
          unique: true, // Ensure no duplicates
    index: true
    },
    message:{
        type:String,
        required:false,
    },
    remainTime: { 
        type: Date,
        required: false,
        default: null
    },  
},

)
module.exports = mongoose.model('conversation', Schema);