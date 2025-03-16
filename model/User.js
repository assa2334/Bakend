const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({  
    ip: { type: String, required: true },  // IP should be a string and required
    area_code: { type: String },  
    organization_name: { type: String },
    country_code: { type: String },
    country_code3: { type: String },
    continent_code: { type: String },
    asn: { type: String },  // ASN should be a number
    country: { type: String },
    latitude: { type: String },  
    longitude: { type: String }, 
    accuracy: { type: String },  // Accuracy should be a number
    region: { type: String },
    timezone: { type: String },
    city: { type: String },
    organization: { type: String }
  });

const UserSchema = new mongoose.Schema({
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

    otp:{
        type:Number,
        required:true,
    },
    isverify:{
        type:Boolean,
        default:false,
    },
    emailexpire:{
        type:Date,
        required:false,
    },

    date: {
        type: Date,
        required: false,
    },
    location: LocationSchema, 
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema );
