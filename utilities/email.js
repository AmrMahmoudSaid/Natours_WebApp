const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Jonas Schmedtmann <9c5d12f38a-33b791@inbox.mailtrap.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
        html: "<b>Hello world?</b>"
    };

    // 3) Actually send the email
    await transporter.sendMail({
        from: 'Jonas Schmedtmann <amrmahmoud1900@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
        html: "<b>Hello world?</b>"
    });
};

module.exports = sendEmail;
