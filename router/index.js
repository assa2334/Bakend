const express = require('express');
const Userctrl = require('../controller/index');
const middelware = require('../middleware/index')

// function import

const router= express.Router();
// add User
router.post('/adduser',Userctrl.addUser);
// get use data
router.post('/getUser',Userctrl.getUser)
// login user
router.post('/loginUser',Userctrl.loginUser);
// name change 
router.post('/Namechange',Userctrl.Namechange);
// change about
router.post('/Aboutchange',Userctrl.Aboutchange);
// chang ProfileImage
router.post('/ProfileImage',middelware.upload.single('ProfileImage'),Userctrl.Aboutchange);
// uploadfile 
router.post('/Uploadfile',middelware.uploadfile.single('file'),Userctrl.UploadFile);
// chage Password 
router.post('/changePassword',  Userctrl.changePassword);
//create conversation
router.post('/conversation',  Userctrl.conversation);
// save message
router.post('/sendmessage', Userctrl.sendmessage);
//find message
router.post('/findmessage', Userctrl.findmessage);
// all user
router.post('/FindUser',middelware.validateToken,Userctrl.FindUser);
// email verify
router.post('/emailverify',Userctrl.emailverify);


module.exports = router;