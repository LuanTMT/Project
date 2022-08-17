require('dotenv').config()
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(toEmail, subject, content, html) {
  // Generate test SMTP service account from ethereal.email

  // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_NAME, // generated ethereal user
      pass: process.env.EMAIL_PW, // generated ethereal password
    },
});
  // send mail with defined transport object
    let info = await transporter.sendMail({
    from: process.env.EMAIL_NAME, // sender address
    to: toEmail, // list of receivers
    subject: subject, // Subject line
    text: content, // plain text body
    html: html
    })
};

module.exports = sendEmail;