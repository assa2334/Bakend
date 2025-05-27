
const jwt = require('jsonwebtoken');
const UserModel = require('../model/User');
const multer = require('multer');
const path = require('path');
const {GridFsStorage} = require('multer-gridfs-storage');
require('dotenv').config();
const middle = {};
require('dotenv').config();


middle.validateToken= async(req,res,next)=>{
    let token = req.headers.token;
  
    if (!token) {
        res.status(400).send('your token not1 find');
    }else{
       try {
        let TokenEmail = jwt.verify(token, process.env.TEXTPASSWORD,);
        if (!TokenEmail.Email) {
            res.status(400).send('your token not2 find');
        }else{
            let Email = TokenEmail.Email
            const user = await UserModel.findOne({ Email });
            if (!user) {
                console.log('user fall');
                res.status(400).send('your token not3 find');
            }if (!user.isverify) {
                res.status(400).send('your token not4 find');
            }
            else{
                console.log('user pass');
                req.user = user
                next()
            }
        }
       } catch (error) {
        res.status(300).send(error);
       }
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploads/img')
    },
    filename: function (req, file, cb) {
      cb(null, req._id)
    }
  })
  const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
};

     middle.upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: fileFilter,
})

const storagefile = new GridFsStorage({
    url: `${process.env.BACKENDURL}`,
    file: (req, file) => {
        let name = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
       console.log('file upoaded');
        req.namefile = name; // Save the name of the file to the request
        console.log('File being processed:', file); // Log the file object
        return {
            filename: name,
            bucketName: 'uploads', // Ensure the correct bucket name is specified
        };
    }
});

middle.uploadfile = multer({
    storage: storagefile,
    limits: { fileSize: 8268435456 }, // Check if file size exceeds the limit
});





module.exports = middle;