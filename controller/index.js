
const UserModel = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const conversation = require('../model/conversation');
const messageSchema = require('../model/Message');

const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const sendToUser = require('../router/socket')
const Userctrl = {};

const funct = require('../function/index');

const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const conn = mongoose.connection;
const validator = require('validator');

const cron = require('node-cron');
const disposable = require('is-disposable-email');

const secretKey = "your_secret_key";






Userctrl.addUser = async (req, res) => {
    console.log('*********** Add User ***********');
    const { Name, FullName, Email, Password } = req.body;
    console.log(req.body, "hello");

    if (req.body && Name && FullName && Email && Password) {
        try {
            const emailDomain = Email.split('@')[1]?.toLowerCase();
            const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (!validator.isEmail(Email)) {
                console.log("Invalid email format.");

                return res.status(400).json('Invalid email format.');
            }

            if (disposable(Email)) {
                return res.status(400).json('Temporary/disposable emails are not allowed');
            }



            const response = await fetch(`https://get.geojs.io/v1/ip/geo.json`);

            const data = await response.json(); // Extract JSON
          


            console.log('user not find 333333');
            const encryptedPassword = CryptoJS.AES.encrypt("123456", secretKey).toString();


            console.log("************ User Email Pass  ************************* ");

            const user = await UserModel.findOne({ Email })
            if (user?.isverify === true) {
                res.status(200).send('Your acount already correct Please Log in')
            }
            else if (user) {
                let obj = await funct.sendemail({ name: Name, FullName, email: Email, about: 'Hey there! I am using WhatsApp.' });

                if (obj.message) {
                    res.status(200).send('Please Enter Correct Email you email adresss is not correct');
                }
                user.otp = await obj?.opt;
                user.emailexpire = new Date(Date.now() + 24 * 60 * 60 * 1000);
                let create = await user.save();
                res.status(200).json({
                    message: 'Your acount create',
                    data: user.Email,
                    isverify: false,
                })
            }
            else {

                let obj = await funct.sendemail({ name: Name, FullName, email: Email, about: 'Hey there! I am using WhatsApp.' });

                if (obj.message) {
                    res.status(200).send('Please Enter Correct Email you email adresss is not correct');
                }
                //  console.log(await obj, "email send");
                let user = await new UserModel({
                    Name,
                    FullName,
                    Email,
                    Password: encryptedPassword,
                    About: 'Hey there! I am using WhatsApp.',
                    img: req.body.img || " ",
                    Status: '',
                    otp: obj?.opt,
                    isverify: false,
                    emailexpire: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    location: {
                        ip: data.ip,
                        area_code: data.area_code || "",
                        organization_name: data.organization_name || "",
                        country_code: data.country_code || "",
                        country_code3: data.country_code3 || "",
                        continent_code: data.continent_code || "",
                        asn: data.asn ? data.asn.toString() : "",
                        country: data.country || "",
                        latitude: data.latitude || "",
                        longitude: data.longitude || "",
                        accuracy: data.accuracy ? data.accuracy.toString() : "",
                        region: data.region || "",
                        timezone: data.timezone || "",
                        city: data.city || "",
                        organization: data.organization || ""
                    }

                });
                let create = await user.save();

                if (create) {

                    res.status(200).json({
                        message: 'Your acount create',
                        data: create.Email,
                        isverify: false,
                    })

                } else {
                    res.status(200).send('An error occurred, please try again 56');
                    console.log('data not sotre 4');
                }
            }

        } catch (error) {
            res.status(200).send('An error occurred, please try again')
        }
    } else {
        res.status(200).send('Please send Complete Parameter')
    }
}

Userctrl.getUser = async (req, res) => {
    console.log("**** Get User Data ****");
    try {
        let users = await UserModel.find();

        // Decrypt passwords if they were stored encrypted (not recommended)
        users = users.map(user => {
            if (user.Password) {
                const decryptedBytes = CryptoJS.AES.decrypt(user.Password, "your_secret_key");
                user.Password = decryptedBytes.toString(CryptoJS.enc.Utf8);
            }
            return user;
        });

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(400).send("Please wait, an error occurred");
    }
};

// Userctrl.emailverify = async (req, res) => {
//     console.log('*********** Email Verify ***********');
//     const { Email, otp } = req.body;
//     console.log(Email, otp);

//     if (!req.body && !Email && !otp) {
//         res.status(200).send('Please send Complete Parameter');
//     }
//     try {
//         let user = await UserModel.findOne({ Email });
//         console.log(user);

//         if (user.otp == otp) {
//             user.isverify = true;
//             let check = await user.save();
//             if (check) {
//                 // Create JWT token with essential user data
//                 const token = jwt.sign(
//                     {
//                         _id: ._id,
//                         Name: user.Name,
//                         FullName: user.FullName,
//                         Email: user.Email,
//                         img: user.img,
//                         isverify: user.isverify
//                         // DO NOT include Password or other sensitive data
//                     },
//                     process.env.JWT_SECRET,
//                     { expiresIn: '7d' } // Token expires in 7 days
//                 );

//                 // Set cookie options
//                 const cookieOptions = {
//                     expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production',
//                     sameSite: 'strict'
//                 };

//                 // Set cookie
//                 res.cookie('token', token, cookieOptions);
//                 return res.status(200).send({ message: 'Email Verify', data: { isverify: true } });
//             } else {
//                 res.status(300).send({ message: 'Email not Verify', data: { isverify: false } });
//             }
//         } else {
//             res.status(200).send({ message: 'Email not Verify', data: { isverify: false } });
//         }
//     } catch (error) {
//         res.status(300).send({ message: 'Some error in email verify', data: { isverify: false } });
//     }
// }

Userctrl.emailverify = async (req, res) => {
    console.log('*********** Email Verify ***********');
    const { Email, otp } = req.body;
    console.log(req.body, "data");

    if (!Email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and OTP are required'
        });
    }

    try {
        const user = await UserModel.findOne({ Email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        console.log(user, "user");

        // Check if OTP exists and is not expired (24-hour check)
        if (!user.emailexpire ||
            new Date() >= new Date(user.emailexpire)) {
            console.log("opt expired");

            return res.status(300).json({
                success: false,
                message: 'if use already use this otp || OTP has expired (valid for 24 hours only)'
            });
        }

        if (`${user.otp}` !== otp) {
            return res.status(300).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Verification successful
        user.isverify = true;
        user.opt = undefined;
        user.emailexpire = undefined;
        await user.save();

        // Create JWT token with essential user data
        const token = jwt.sign(
            {
                _id: user._id,
                Name: user.Name,
                FullName: user.FullName,
                Email: user.Email,
                img: user.img,
                isverify: user.isverify
                // DO NOT include Password or other sensitive data
            },
            process.env.TEXTPASSWORD,
            { expiresIn: '7d' } // Token expires in 7 days
        );

        const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
           
            httpOnly: true,
            secure: false,
            sameSite: 'Lax', // Changed from None
            path: '/',
            // path: '/',
            // // permanent: true,
            // priority: 'high',
            //  domain: 'localhost' // Omit in development
        };

        res.cookie('authToken', token, cookieOptions).status(200).send({ message: 'Email Verify', data: { isverify: true,token, } });;



    } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during verification'
        });
    }
};

// login user
Userctrl.loginUser = async (req, res) => {
    console.log('*********** Login User ***********');
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).send('Please provide both email and password');
    }

    try {
        const user = await UserModel.findOne({ Email });
        if (!user) {
            return res.status(404).send('Account not found. Please create an account');
        }

        // Decrypt the stored password
        const decryptedBytes = CryptoJS.AES.decrypt(user.Password, "your_secret_key");
        const decryptedPassword = decryptedBytes.toString(CryptoJS.enc.Utf8);

        // Compare passwords
        if (Password === decryptedPassword || req.body.email_verified === true ) {
             const token = jwt.sign(
            {
                _id: user._id,
                Name: user.Name,
                FullName: user.FullName,
                Email: user.Email,
                img: user.img,
                isverify: user.isverify
                // DO NOT include Password or other sensitive data
            },
            process.env.TEXTPASSWORD,
            { expiresIn: '7d' } // Token expires in 7 days
        );
   const cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
           
            httpOnly: true,
            secure: false,
            sameSite: 'Lax', // Changed from None
            path: '/',
            // path: '/',
            // // permanent: true,
            // priority: 'high',
            //  domain: 'localhost' // Omit in development
        };
            return    res.cookie('authToken', token, cookieOptions).status(200).json({
                message: 'Welcome Back',
                data: user.Email,
                token
            });
        } else {
            return res.status(401).send({message:'Invalid credentials'});
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).send('Internal server error');
    }
};

// change name 

Userctrl.Namechange = async (req, res) => {
    console.log('*********** Change Name ***********');
    const { Name } = req.body;
    const user = req.user;
    if (req.body && Name) {
        try {
            user.Name = Name;
            let check = await UserModel.save();
            if (check) {
                res.status(200).json({
                    message: 'Name Change',
                })
            } else {
                res.status(300).send('Name not change sorry!')
            }

        } catch (error) {
            console.log('Some error in user Change name 5');
            res.status(300).send({
                erro: error,
            })
        }
    } else {
        res.status(400).send({
            error: 'Please send Complete Parameter'
        })
    }
}

// change about 
Userctrl.Aboutchange = async (req, res) => {
    console.log('*********** Change About ***********');
    const { About } = req.body;
    const user = req.user;
    if (req.body && About) {
        try {
            user.About = About;
            let check = await user.save();
            if (check) {
                res.status(200).json({
                    message: 'Name About',
                    data: user,
                })
            } else {
                res.status(300).send('About not change sorry!')
            }

        } catch (error) {
            console.log('Some error in user Change About 5');
            res.status(300).send({
                erro: error,
            })
        }
    } else {
        res.status(400).send({
            error: 'Please send Complete Parameter'
        })
    }
}

// ProfileImage
Userctrl.ProfileImage = async (req, res) => {
    console.log('*********** Profile Image ***********');
    const user = req.user;
    if (req.file) {
        try {
            user.img = req.file.path;
            let check = await user.save();
            if (check) {
                res.status(200).json({
                    message: 'File Upload',
                })
            } else {
                res.status(300).send('File not Upload!')
            }

        } catch (error) {
            console.log('Some error in file save 5');
            res.status(300).send({
                erro: error,
            })
        }
    } else {
        res.status(400).send({
            error: 'Please send Complete Parameter'
        })
    }
}

//change Password
Userctrl.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword && !newPassword) {
        return res.status(400).json({ error: 'Please provide both current and new passwords.' });
    }

    try {
        const match = await bcrypt.compare(currentPassword, user.Password);
        if (!match) {
            return res.status(400).json({ error: 'Current password is incorrect.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.Password = hashedPassword;
        let value = await user.save();
        if (value) {
            res.send({
                message: 'Password change'
            })
        } else {
            res.send('Password not change')
        }

    } catch (error) {
        res.send({ error })

    }

    res.status(200).json({ message: 'Password changed successfully.' });
};
// create conversation
Userctrl.conversation = async (req, res) => {
    console.log('********* conversation**********');
    let { senderid, receiverid } = req.body;
    console.log('********* conversation**********', senderid, receiverid);
    if (!req.body && !senderid && !receiverid) {
        res.status(401).send('Please sned complete Parameter ');
    }

    try {
            const key = [senderid, receiverid].sort().join('_');
             console.log('conversation key:', key);
        let user = await conversation.findOne({ conversation: key });
        if (user) {
            res.send(user);
        } else {
            let user = new conversation({
                conversation: key

            })
            let save = await user.save()
            if (save) {
                res.status(200).send({
                    message: 'conversation id create',
                    data: user,
                });
            } else {
                res.status(401).send('some error this code');
            }
        }
    } catch (error) {
        res.status(300).send('Some error your code');
        console.log('create conversation function crach');

    }
}
let deleteMessages = {}; // Changed variable name to plural for clarity

async function DeleteMessageWithCron() {
  try {
          const conn = mongoose.connection;
        const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: "uploads" // your bucket name
        });
    // Case 1: Delete specific messages with cron jobs
    if (Object.keys(deleteMessages).length > 0) {
    const conversationId = Object.keys(deleteMessages)[0];

            const expires = deleteMessages[conversationId];
            const totalSeconds = Math.floor(expires / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;



             const cronTime = `${seconds} ${minutes}  ${hours} * * *`;
        console.log(cronTime,conversationId,deleteMessages,expires,"data");
        
        // Schedule deletion for each message at its specific time
        cron.schedule(cronTime, async () => {
        
              const messages = await messageSchema.find({ conversation: conversationId });
                for (const message of messages) {
                     if (message.mediaUrl) {
                        // Initialize GridFS connection
                        try {
                // Extract filename from URL (adjust based on your URL structure)
                const filename = message.mediaUrl.split('/').pop();

                // Find and delete the file
                const files = await gfs.find({ filename }).toArray();
                if (files.length > 0) {
                    await gfs.delete(files[0]._id);
                    console.log("File deleted from GridFS");
                } else {
                    console.log("No matching file found in GridFS");
                }
            } catch (fileError) {
                console.error("Error deleting file:", fileError);
                // Continue with message deletion even if file deletion fails
            }
      
                     }
                }
            await messageSchema.deleteMany({ conversation: conversationId });
            delete deleteMessages[conversationId];
            await conversation.findByIdAndUpdate({ _id: conversationId },{remainTime:null},{ new: true } );
            console.log(`Deleted messages for conversation ${conversationId}`);
        });
        
    } 
    // Case 2: Delete all messages (when deleteMessages is empty)
    else {
        cron.schedule('*/30 * * * * *', async () => {
        
              const messages = await messageSchema.find();
                for (const message of messages) {
                     if (message.mediaUrl) {
                        // Initialize GridFS connection
                        try {
                // Extract filename from URL (adjust based on your URL structure)
                const filename = message.mediaUrl.split('/').pop();

                // Find and delete the file
                const files = await gfs.find({ filename }).toArray();
                if (files.length > 0) {
                    await gfs.delete(files[0]._id);
                    console.log("File deleted from GridFS");
                } else {
                    console.log("No matching file found in GridFS");
                }
            } catch (fileError) {
                console.error("Error deleting file:", fileError);
                // Continue with message deletion even if file deletion fails
            }
      
                     }
                }
            await messageSchema.deleteMany({ conversation: conversationId });
            delete deleteMessages[conversationId];
            await conversation.findByIdAndUpdate({ _id: conversationId },{remainTime:null},{ new: true } );
            console.log(`Deleted messages for conversation ${conversationId}`);
        });
    }
}catch (error) {
    console.error("Error in DeleteMessageWithCron:", error);
}
}



DeleteMessageWithCron()
async function updataconversation(conversationId, text, remainTime) {
    console.log("**** update conversation function called ****", conversationId, text, remainTime);

  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Fetch existing conversation
      const existingConversation = await conversation.findById({_id : conversationId});

            if (!existingConversation) {
                throw new Error("Conversation not found");
            }

      // Step 2: Check remdainTime
      if (existingConversation.remdainTime == null) {
        // Step 3: Update only if remdainTime is null
        const updatedConversation = await conversation.findByIdAndUpdate(
          {_id:conversationId},
          {
            // message: text,
            remainTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          },
          { new: true }
        );

                // Step 4: Set up deletion timer
                deleteMessages[conversationId] = 86400000;
                DeleteMessageWithCron();

                console.log("Conversation updated successfully:", updatedConversation);
            } else {
                console.log("remdainTime already set, no update performed.");
            }

            resolve();
        } catch (error) {
            console.error("Error updating conversation:", error);
            reject(error);
        }
    });
}

// send message
Userctrl.sendmessage = async (req, res) => {
    let { conversation, sender, recipient, text, remainTime } = req.body;
    console.log("**** send message function called ****", req.body);
    console.log(deleteMessages, "deleteMessage");

    if (!conversation && !sender && !recipient && !text) {
        res.send('Please send complete Parameter');
    } else {
        try {
            let message = new messageSchema({
                conversation,
                sender,
                recipient,
                text,
            })
            let check = await message.save();
            if (check) {
                sendToUser.sendToUser(recipient, {
                    type: 'new_message',
                    data: message
                })
                updataconversation(conversation, text, remainTime);
                res.status(200).send({
                    messsage: 'save',
                    data: message,

                })



            } else {
                res.status(401).send('some error');
            }
        } catch (error) {
            res.status(300).send({
                error: error,
            });
            console.log('message send  function crash');
        }
    }
}

Userctrl.updateMessage = async (req, res) => {
    console.log("**** updata message ***** ");

    const { messageId, text } = req.body;

    if (!messageId || !text) {
        return res.status(400).send("Message ID and new text are required");
    }

    try {
        const updatedMessage = await messageSchema.findByIdAndUpdate(
            { _id: messageId },  // First parameter: the ID
            { text: text },  // Second parameter: update object
            { new: true }  // Third parameter: options
        );

        if (!updatedMessage) {
            return res.status(404).send("Message not found");
        }

        return res.status(200).send({
            message: "Message updated successfully",
            data: updatedMessage,
        });
    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).send("Server error");
    }
};

//fetch message
Userctrl.findmessage = async (req, res) => {

    let { conversation } = req.body;
    console.log("**** message find *******", conversation);
    if (!req.body && !conversation) {
        res.send('Please send complete Parameter');
    } else {
        try {
            let message = await messageSchema.find({ conversation });
            if (message) {
        

                res.send({
                    data: message
                })
            } else {
                res.send('some error')
            }

        } catch (error) {
            res.status(300).send({
                error: error,
            });
            console.log('create conversation function crash');
        }
    }

}
Userctrl.deleteMessage = async (req, res) => {
    const { messageId } = req.body;

    if (!messageId) {
        return res.status(400).send("Message ID is required");
    }

    try {
        // Initialize GridFS connection
        const conn = mongoose.connection;
        const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
            bucketName: "uploads" // your bucket name
        });

        const message = await messageSchema.findById(messageId);
        if (!message) {
            return res.status(404).send("Message not found");
        }

        // Delete media file if exists
        if (message.messageType !== "text" && message.mediaUrl) {
            try {
                // Extract filename from URL (adjust based on your URL structure)
                const filename = message.mediaUrl.split('/').pop();

                // Find and delete the file
                const files = await gfs.find({ filename }).toArray();
                if (files.length > 0) {
                    await gfs.delete(files[0]._id);
                    console.log("File deleted from GridFS");
                } else {
                    console.log("No matching file found in GridFS");
                }
            } catch (fileError) {
                console.error("Error deleting file:", fileError);
                // Continue with message deletion even if file deletion fails
            }
        }

        // Delete the message
        await messageSchema.findByIdAndDelete(messageId);

        return res.status(200).send({
            message: "Message deleted successfully",
        });
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).send("Server error");
    }
};


//fetch User
Userctrl.FindUser = async (req, res) => {
    console.log("*****User Find ********");

    try {
        let UserFind = await UserModel.find();
        if (UserFind) {
            let object = UserFind.filter((value) => {
                if (value.Name === req.user.Name) {
                    value.Name = `${req.user.Name}(You)`
                    return value
                }
                return value;
            })
            res.send({
                data: object,
            })
        } else {
            res.send('some error')
        }

    } catch (error) {
        res.status(300).send({
            error: error,
        });
        console.log('create conversation function crash');
    }
}
Userctrl.UploadFile = async (req, res) => {
    console.log("************ Upload File ************************* ");
    if (!req.body && !req.file) {
        console.log(req.body, 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhdj');
        return res.status(200).send('Please send complete parameters');
    }
    try {
        // Save the message to the database with the uploaded file URL
        let message = new messageSchema({
            conversation: req.body.conversation,
            sender: req.body.sender,
            recipient: req.body.recipient,
            messageType: req.body.Type,
            mediaUrl: `/api/files/${req.file.filename}`
        });

        let check = await message.save();
        if (check) {
            sendToUser.sendToUser(req.body.recipient, {
                type: 'new_message',
                data: message
            })
            res.status(200).send({
                message: 'Message saved successfully',
                data: message,
            });
        } else {
            res.status(401).send('Some error occurred');
        }
    } catch (error) {
        res.status(200).send(error);
        console.log('Create conversation function crashed', error);
    }
}

let strogeTime = {};




function scheduleCron() {
    console.log("**** scheduleCron function called ****");
    if (Object.keys(strogeTime).length > 0) {

        console.log(strogeTime, "strogeTime 1");

        const firstKey = Object.keys(strogeTime)[0];
        const expiry = strogeTime[firstKey].expiry;
        const userId = strogeTime[firstKey].userId;


        const cronTime = `${expiry} * * * * *`;

        console.log("cronTime:", cronTime, expiry, firstKey);
        cron.schedule(cronTime, async () => { // Runs every 30 minutes for better precision
            console.log("🕒 Cron triggered. Deleting:", firstKey);


            try {
                const conn = mongoose.connection;
                const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                    bucketName: "uploads"
                });




                try {
                    const filename = firstKey;

                    const files = await gfs.find({ filename }).toArray();

                    if (files.length > 0) {
                        await gfs.delete(files[0]._id);
                        console.log(`Deleted file: ${filename} for user ${userId}`);

                        // Clear the status and date in user document
                        await UserModel.findByIdAndUpdate(userId, {
                            $unset: { Status: "", date: "" }
                        });
                        delete strogeTime[filename];
                        console.log("status delete ");

                    } else {
                        console.log(`No file found for ${filename}, cleaning user record`);
                        await UserModel.findByIdAndUpdate(userId, {
                            $unset: { Status: "", date: "" }
                        });
                    }
                } catch (err) {
                    console.error(`Error processing user ${userId}:`, err);
                }

            } catch (error) {
                console.error('Error in status cleanup cron job:', error);
            }
        });

    }

    else {
        cron.schedule('*/59 * * * *', async () => { // Runs every 30 minutes for better precision

            console.log("**** cron job run every 2 mint complete *******");

            try {
                const conn = mongoose.connection;
                const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
                    bucketName: "uploads"
                });

                // Calculate the time 24 hours ago
                const twentyFourHoursAgo = new Date(Date.now() - 60 * 60 * 1000);
                console.log(twentyFourHoursAgo, "twentyFourHoursAgo");
                const usersWithExpiredStatus = await UserModel.find({
                    Status: { $exists: true, $ne: "" },
                })



                console.log(usersWithExpiredStatus, "find with data base");


                // Delete each expired status file
                for (const user of usersWithExpiredStatus) {
                    console.log(user, "find usr");

                    try {
                        const filename = user.Status.split('/').pop();
                        const files = await gfs.find({ filename }).toArray();

                        if (files.length > 0) {
                            await gfs.delete(files[0]._id);
                            console.log(`Deleted file: ${filename} for user ${user._id}`);

                            // Clear the status and date in user document
                            await UserModel.findByIdAndUpdate(user._id, {
                                $unset: { Status: "", date: "" }
                            });
                            console.log("status delete ");

                        } else {
                            console.log(`No file found for ${filename}, cleaning user record`);
                            await UserModel.findByIdAndUpdate(user._id, {
                                $unset: { Status: "", date: "" }
                            });
                        }
                    } catch (err) {
                        console.error(`Error processing user ${user._id}:`, err);
                    }
                }
            } catch (error) {
                console.error('Error in status cleanup cron job:', error);
            }
        });
    }
}


scheduleCron()
// Upload Video
Userctrl.UploadVideo = async (req, res) => {
    console.log("************ Upload Video *************************");

    // Check if request contains necessary data
    if (!req.body || !req.file) {
        console.log("Incomplete parameters:", req.body);
        return res.status(400).send('Please send complete parameters');
    }

    try {
        const userid = req.user; // Assuming req.user contains the authenticated user's ID
        const statusUrl = `/api/files/${req.file.filename}`;



        // Update the user's status and status expiry
        const updateResult = await UserModel.findByIdAndUpdate(userid, { Status: statusUrl, date: new Date(), expiryDate: 56 }, { new: true });

        if (updateResult) {
            strogeTime[req.file.filename] = {
                expiry: 56,
                userId: userid._id
            };
            scheduleCron();
            console.log({ 'message': "Status updated successfully:" });
            res.status(200).send({
                message: 'Status updated successfully',
                data: updateResult,
            });
            console.log(strogeTime, "strogeTime 2");

        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error("Error in UploadVideo:", error);
        res.status(500).send({
            message: 'Internal server error',
            error: error.message,
        });
    }
};


Userctrl.getCallHistory = async (req, res) => {
    console.log("**** get Call History ****");
    const conversationId = req.params.conversationId;
 // Assuming conversationId is passed as a query parameter
    if (!conversationId) {
        return res.status(400).send("Conversation ID is required");
    }
    try {
        const callHistory = await messageSchema.find({
            conversation: conversationId,
            isCall: true // Assuming isCall is a boolean field indicating call messages
        }).sort({ createdAt: -1 }); // Sort by createdAt in descending order
        if (callHistory.length === 0) {
            return res.status(404).send("No call history found for this conversation");
        }
        res.status(200).json({
            message: "Call history retrieved successfully",
            data: callHistory
        });
    }
    catch (error) {
        console.error("Error fetching call history:", error);
        res.status(500).send("Internal server error");
    }
}




module.exports = Userctrl;