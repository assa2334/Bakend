// package import
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./connection/index');
require('dotenv').config();
const {Server} = require('socket.io');
const http = require('http');
// router import
const route= require('./router/index');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { Readable } = require('stream');
const { MongoClient, GridFSBucket } = require('mongodb');




const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
let port = process.env.PORT;
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:'*',
        methods:'POST,GET'
    },
})

// io.on('connection',(socket)=>{
//     console.log(' user connection',socket.id);
    
//     socket.on("sendMessage",(data)=>{
//         io.emit("receiveMessage",{message:data})
//         console.log(data);
        
//     })

//     socket.on('disconnection',()=>{
//         console.log('disconnect',socket.id);
//     })
// })

// app.get('/',(req,res)=>{
//     res.send('Welcome');
// });
app.use('/api/v8',route)




mongoose.connect(`mongodb+srv://${process.env.NAME}:${process.env.PASSWORD}@cluster0.mxi10.mongodb.net/?retryWrites=true&w=majority&appName=${process.env.PROJECT}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const conn = mongoose.connection;
let gridFSBucket;

conn.once('open', () => {
    console.log('MongoDB connected successfully');
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
});

app.get('/file/:filename', async (req, res) => {
    const { filename } = req.params;
    console.log('*********** File name ************', filename);
  
    try {
      // Check if the file exists in GridFS
      const file = await conn.db.collection('uploads.files').findOne({ filename });
  
      if (!file) {
        return res.status(404).send(`File not found: ${filename}`);
      }
  
      const mime = require('mime-types');
      const fileExtension = mime.extension(file.contentType) || 'bin';
      console.log('*********** File Extension ************', fileExtension);
      console.log('*********** File ************', file);
  
      // Set headers for the response
      res.set('Content-Type', file.contentType);
  
      if (file.contentType === 'video/mp4') {
        // Stream video file to client
        const readStream = gridFSBucket.openDownloadStreamByName(filename);
        readStream.on('error', (err) => {
          console.error('Stream error:', err);
          res.status(500).send('Stream error');
        });
  
        // Allow video streaming by the client
        res.set('Accept-Ranges', 'bytes');
        readStream.pipe(res);
      } else {
        // Download other file types as an attachment
        res.set('Content-Disposition', `attachment; filename="${file.filename}.${fileExtension}"`);
        const readStream = gridFSBucket.openDownloadStreamByName(filename);
        readStream.on('error', (err) => {
          console.error('Stream error:', err);
          res.status(500).send('Stream error');
        });
        readStream.pipe(res);
      }
    } catch (err) {
      console.error('Error fetching file:', err);
      res.status(500).send('Error fetching file');
    }
  });
  











server.listen(port,(error)=>{
    if (error) {
        console.log('some error this code',error);
    }
    console.log('server run',port);
    
})
