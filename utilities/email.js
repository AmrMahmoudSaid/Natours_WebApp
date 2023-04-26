const nodemailer = require('nodemailer');
const {env} = require("ndp/.eslintrc");
const pug = require('pug');
const htmlToText = require('html-to-text');
module.exports = class Email{
    constructor(user,url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Amr Mahmoud <${process.env.EMAIL_FROM}>`;
    }
    creatTransport(){
        if (process.env.NODE_ENV==='production'){
            return nodemailer.createTransport({
               service : 'SendGrid' ,
                auth :{
                   user: process.env.SENDGRID_USERNAME,
                    pass:process.env.SENDGRID_PASSWORD
                }
            });
        }else {
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                // secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }
    }
    async send(template , subject ){
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName : this.firstName ,
            // tour : tour.name,
            // price : price,
            url : this.url,
            subject
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        }
        await this.creatTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('welcome','Welcome to the Natours Family')
    }
    async sendPasswordRest(){
        await this.send('passwoedRest' , 'Your Password rest token valid for 10 m ')
    }
    async sendPayment(){
        await this.send('paymentEmail','Payment confirmation' )
    }
}
