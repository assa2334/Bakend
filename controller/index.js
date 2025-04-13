
const UserModel = require('../model/User');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const conversation = require('../model/conversation');
const messageSchema = require('../model/Message');

const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");

const Userctrl = {};

const funct = require('../function/index');




const secretKey = "your_secret_key";
Userctrl.addUser = async (req, res) => {
    console.log('*********** Add User ***********');
    const { Name, FullName, Email, Password } = req.body;
    if (req.body && Name && FullName && Email && Password) {
        try {
            const user = await UserModel.findOne({ Email })
            if (user?.isverify === true) {
                res.status(200).send('Your acount already correct Please Log in')
            }
            else {
                    let obj = await funct.sendemail({ name: Name, FullName, email: Email, about: 'Hey there! I am using WhatsApp.' });
                    if (obj.message) {
                        res.status(200).send('Please Enter Correct Email you email adresss is not correct');
                    }

                    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
                    console.log(response);
                    const data = await response.json(); // Extract JSON

                    console.log(obj,"email send");
                    
                console.log('user not find 333333');
                const encryptedPassword = CryptoJS.AES.encrypt("123456", secretKey).toString();
              
                let user = new UserModel({
                    Name,
                    FullName,
                    Email,
                    Password:encryptedPassword,
                    About: 'Hey there! I am using WhatsApp.',
                    img:req.body.img || " ",
                    Status: '',
                    otp: obj.opt,
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
                    let token = jwt.sign({ Email }, `${process.env.TEXTPASSWORD}`);
                    res.status(200).json({
                        message: 'Your acount create',
                        data: create,
                        token,
                        isverify:false,
                    })

                } else {
                    res.status(200).send('An error occurred, please try again');
                    console.log('data not sotre 4');
                }
            }

        } catch (error) {
            res.status(200).send('An error occurred, please try again')
        }
    } else {
        res.status(200).send( 'Please send Complete Parameter')
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

Userctrl.emailverify = async (req, res) => {
    console.log('*********** Email Verify ***********');
    const { Email, otp } = req.body;
    console.log(Email,otp);
    
    if (!req.body && !Email && !otp) {
        res.status(200).send('Please send Complete Parameter');
    }
        try {
            let user = await UserModel.findOne({Email });
            console.log(user);
            
            if (user.otp == otp ) {
                user.isverify = true;
                let check = await user.save();
                if (check) {
                    res.status(200).send({ message:'Email Verify',data:{isverify:true}});
                } else {
                    res.status(300).send({ message:'Email not Verify',data:{isverify:false}});
                }
            } else {
                res.status(200).send({ message:'Email not Verify',data:{isverify:false}});
            }
        } catch (error) {
            res.status(300).send({message:'Some error in email verify',data:{isverify:false}});
        }
    }

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
        if (Password === decryptedPassword || req.body.email_verified === true) {
            let token = jwt.sign({ Email }, `${process.env.TEXTPASSWORD}`);
            return res.status(200).json({
                message: 'Welcome Back',
                data: user,
                token
            });
        } else {
            return res.status(401).send('Invalid credentials');
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
    if (req.body && Name ) {
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
                            data:user,
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
    let value =  await user.save();
    if (value) {
        res.send({
            message:'Password change'
        })
    }else{
        res.send('Password not change')
    }

   } catch (error) {
    res.send({error})
    
   }

    res.status(200).json({ message: 'Password changed successfully.' });
};
// create conversation
Userctrl.conversation= async (req,res)=>{
    console.log('********* conversation**********');
    let {senderid,receiverid}= req.body;
    if (!req.body && !senderid && !receiverid) {
      res.status(401).send('Please sned complete Parameter ');  
    }
    try {
        let user = await conversation.findOne({conversation :{$all:[senderid, receiverid]}}) 
        if (user) {
            res.send(user);
        }else{
            let user =  new conversation({
                conversation:[senderid,receiverid],
                message:'',  
            })
            let save = await user.save()
            if (save) {
                res.status(200).send({
                    message:'conversation id create',
                    data:user,
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
// send message
Userctrl.sendmessage = async (req,res)=>{
    let {conversation,sender,recipient,text}= req.body;
    if (!conversation && !sender && !recipient && !text) {
        res.send('Please send complete Parameter');
    }else{
        try {
            let message = new messageSchema({
                conversation,
                sender,
                recipient,
                text,
            })
            let check = await message.save();
            if (check) {
                res.status(200).send({
                    messsage:'save',
                    data:message,
                })
            }else{
                res.status(401).send('some error');
            }
        } catch (error) {
            res.status(300).send({
                error:error,
            });
            console.log('create conversation function crash');
        }
    }
}
//fetch message
Userctrl.findmessage = async(req,res)=>{
    let {conversation}= req.body;
    if (!req.body && !conversation) {
        res.send('Please send complete Parameter');
    }else{
        try {
                let message = await messageSchema.find({ conversation });
                if (message) {
                    res.send({
                        data:message
                    })
                }else{
                    res.send('some error')
                }
            
        } catch (error) {
            res.status(300).send({
                error:error,
            });
            console.log('create conversation function crash');
        }
    }
   
}


//fetch User
Userctrl.FindUser = async(req,res)=>{
    console.log("*****User Find ********");
    
        try {
                let UserFind = await UserModel.find();
                if (UserFind) {
                   let object = UserFind.filter((value)=>{
                    if (value.Name === req.user.Name) {
                        value.Name = `${req.user.Name}(You)`
                    return value
                }
                return value;
                  })
                    res.send({
                        data:object,
                    })
                }else{
                    res.send('some error')
                }
            
        } catch (error) {
            res.status(300).send({
                error:error,
            });
            console.log('create conversation function crash');
        }
}
Userctrl.UploadFile = async (req, res) => {
    console.log("************ Upload File ************************* ");
    if (!req.body && !req.file) {
        console.log(req.body,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhdj');
        return res.status(200).send('Please send complete parameters');   
    }
    try {
        // Save the message to the database with the uploaded file URL
        let message = new messageSchema({
            conversation:req.body.conversation,
            sender:req.body.sender,
            recipient:req.body.recipient,
            messageType: req.body.Type,
            mediaUrl:`http://localhost:9000/file/${req.file.filename}` 
        });

        let check = await message.save();
        if (check) {
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
        const statusUrl = `http://localhost:9000/file/${req.file.filename}`;

      

        // Update the user's status and status expiry
        const updateResult = await UserModel.findByIdAndUpdate( userid,{ Status: statusUrl,date: new Date(),}, { new: true });

        if (updateResult) {
            console.log({'message':"Status updated successfully:"});
            res.status(200).send({
                message: 'Status updated successfully',
                data: updateResult,
            });
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






module.exports = Userctrl;