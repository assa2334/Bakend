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
const socketHandler = require('./router/socket');
const fetch = require("node-fetch");

const allowedOrigin = 'https://whatsapp-clone-one-phi.vercel.app';
const app = express();
app.use(cors());
app.use(cors({
  origin: allowedOrigin, // Your frontend URL
  credentials: true, // This is crucial!
  exposedHeaders: ['set-cookie']
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
let port = process.env.PORT || 9001;
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
      origin: allowedOrigin, // ✅ Allow both local & network clients
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    },
})

socketHandler.socketHandler(io);

app.get('/',(req,res)=>{
    res.send('Welcome');
});
app.use('/api/v8',route)




// mongoose.connect(`${process.env.BACKENDURL}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

const conn = mongoose.connection;
let gridFSBucket;

conn.once('open', () => {
    console.log('MongoDB connected successfully');
    gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads',
    });
});

app.get('/api/files/:filename', async (req, res) => {
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
  

// app.get('/api/files/:filename', async (req, res) => {
//     const { filename } = req.params;
//     console.log('*********** File name ************', filename);

//     try {
//         // Check if the file exists in GridFS
//         const file = await conn.db.collection('uploads.files').findOne({ filename });

//         if (!file) {
//             return res.status(404).send(`File not found: ${filename}`);
//         }

//         const mime = require('mime-types');
//         const fileExtension = mime.extension(file.contentType) || 'bin';
//         console.log('*********** File Extension ************', fileExtension);

//         // Set common headers
//         res.set('Content-Type', file.contentType);
//         res.set('Accept-Ranges', 'bytes'); // Enable range requests
//         res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

//         // Handle range requests (for parallel downloads)
//         const range = req.headers.range;
//         if (range) {
//             // Parse range (example: "bytes=0-999")
//             const parts = range.replace(/bytes=/, "").split("-");
//             const start = parseInt(parts[0], 10);
//             const end = parts[1] ? parseInt(parts[1], 10) : file.length - 1;
//             const chunkSize = (end - start) + 1;

//             // Set partial content headers
//             res.status(206);
//             res.set('Content-Range', `bytes ${start}-${end}/${file.length}`);
//             res.set('Content-Length', chunkSize);

//             // Create stream for the specific range
//             const readStream = gridFSBucket.openDownloadStream(file._id, {
//                 start,
//                 end: end + 1 // GridFS expects end to be exclusive
//             });

//             readStream.on('error', (err) => {
//                 console.error('Stream error:', err);
//                 if (!res.headersSent) {
//                     res.status(500).send('Stream error');
//                 }
//             });

//             readStream.pipe(res);
//         } else {
//             // For non-range requests or small files
//             if (file.contentType.startsWith('video/') || file.contentType.startsWith('audio/')) {
//                 // Stream media files directly
//                 res.set('Content-Length', file.length);
//                 const readStream = gridFSBucket.openDownloadStreamByName(filename);
//                 readStream.pipe(res);
//             } else {
//                 // Download other files as attachment
//                 res.set('Content-Disposition', `attachment; filename="${file.filename}.${fileExtension}"`);
//                 res.set('Content-Length', file.length);
//                 const readStream = gridFSBucket.openDownloadStreamByName(filename);
//                 readStream.pipe(res);
//             }
//         }
//     } catch (err) {
//         console.error('Error fetching file:', err);
//         res.status(500).send('Error fetching file');
//     }
// });









server.listen(port ,"0.0.0.0",(error)=>{
    if (error) {
        console.log('some error this code',error);
    }
    console.log('server run',port);
    
})
