// const mongoose = require('mongoose');
// require('dotenv').config();
// // mongodb+srv://anasanas21332:7l95Ze9et4xb0xKz@cluster0.xmyps.mongodb.net/whatsapp?retryWrites=true&w=majority
// let url= "mongodb+srv://anasanas21332:hello123@cluster0.mxi10.mongodb.net/"
// mongoose.connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => {
//     console.log("✅ DATABASE CONNECTED SUCCESSFULLY");
// })
// .catch((error) => {
//     console.error("❌ Database connection failed:", error.message);
// });

// module.exports = mongoose.connection;
const mongoose = require('mongoose',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
require('dotenv').config();

mongoose.connect(`${process.env.BACKENDURL}`)
.then(()=>{
console.log("DATABASE CONNECTION");
}).catch((error)=>{
    console.log('Database not connection',error);
    
})