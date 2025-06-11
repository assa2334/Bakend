
const nodemailer = require("nodemailer");

const funct = {}
funct.sendemail = async (prop) => {
  const { name,FullName,email,about } = prop;
  console.log(name,FullName,email,about,"Error 123");
  console.log('user not find 4444444');
    
    console.log("************ Send Email ************************* ");
    if (!email) {
        return res.status(200).send('Please send complete parameters');
    }
   try {
     
    const transporter = await  nodemailer.createTransport({
        service: "gmail",
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.EMAIL, // Your email address
          pass: process.env.PASSWORD, // Your email password or app password
        },
      });
      let opt = await Math.floor(100000 + Math.random() * 900000);
      const info =  await transporter.sendMail({
        from: '"Subhan Ashraf 👻" <subhanashrafgujjar@gmail.com>', // Sender address
        to: `${email}`, // Recipient
        subject: "Your are login my website", // Email Subject
        text: `${name}`, // Plain text version
        html: `
        <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #007bff; padding: 15px; border-radius: 10px 10px 0 0; text-align: center; color: #fff;">
                <h2 style="margin: 0;">Welcome to My Website</h2>
            </div>
    
            <div style="padding: 20px; background-color: #fff; border-radius: 0 0 10px 10px;">
                <h3 style="color: #333;">Hello, ${name}!</h3>
                <p style="font-size: 16px; color: #555;">
                    Thank you for logging in to our website. Please use the OTP below to verify your account.
                </p>
    
                <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 8px; font-size: 24px; font-weight: bold; color: #007bff;">
                    ${opt}
                </div>
    
                <p style="font-size: 16px; color: #555; margin-top: 20px;">
                    Here are your details:
                </p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Name:</strong> ${name}</li>
                    <li><strong>Full Name:</strong> ${FullName}</li>
                    <li><strong>Email:</strong> ${email}</li>
                </ul>
    
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    If you did not request this login, please ignore this email.
                </p>
             
            </div>
        </div>
        `, // HTML Body
    });
    console.log("Error 123", info.messageId);
    let obj = {
      info,
      opt,
    }
    return await obj ;
      
   } catch (error) {
    let obj = {
      message : "Error in sending email",
      error:error
    }
    console.log("Error 123", error);
    
    return obj;

   }
}



module.exports = funct;