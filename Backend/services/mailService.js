const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    secure:true,
    auth:{
        user:email,
        pass:password
    }
})

const SignupMailService = async ({emailId,userName,role,verificationToken}) => {

    try
    {
        let verificationLink;
        let subject;
        let emailTemplate;

        if(role === "user") {
            verificationLink = `http://localhost:4000/users/verify/${verificationToken}`;
            subject = "'Welcome to Rydr-Let\'s get Moving! 🚗💨";
            emailTemplate = fs.readFileSync(path.join(__dirname,"../views/UserSignupMailView.html"),"utf8");
        } else {
            verificationLink = `http://localhost:4000/captains/verify/${verificationToken}`;
            subject = "Welcome Aboard, Captain! 🏎️🚀";
            emailTemplate = fs.readFileSync(path.join(__dirname,"../views/CaptainSignupMailView.html"),"utf8");
        }

        const emailContent = emailTemplate.replace("{{userName}}",userName).replace("{{verificationLink}}",verificationLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailId,
            subject:subject,
            html:emailContent
        });

    }
    catch(err) {
        console.log(err);
    }
}

const ForgotPasswordMailService = async ({emailId,userName,verificationToken,role}) => {
    try
    {
        const subject = "Password Reset Request";
        let verificationLink;

        if(role === 'user') {
            verificationLink = `${process.env.CLIENT_URL}/reset-password?verificationToken=${verificationToken}`;            
        }
        else {
            verificationLink = `${process.env.CLIENT_URL}/captain-reset-password?verificationToken=${verificationToken}`;
        }

        const emailTemplate = fs.readFileSync(path.join(__dirname,"../views/ForgotPasswordMailView.html"),"utf-8");
        const emailContent = emailTemplate.replace("{{userName}}",userName).replace("{{verificationLink}}",verificationLink);

        const info = await transporter.sendMail({
            from:email,
            to:emailId,
            subject:subject,
            html:emailContent
        });

    } catch(err) {
        console.log(err);
    }
}

module.exports = {SignupMailService,ForgotPasswordMailService}