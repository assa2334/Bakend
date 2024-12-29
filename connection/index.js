const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.mxi10.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.PROJECT}`)
.then(()=>{
console.log("DATABASE CONNECTION");
}).catch((error)=>{
    console.log('Database not connection',error);
    
})

