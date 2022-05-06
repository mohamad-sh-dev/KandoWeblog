const nodeMailer = require("nodemailer");
const ejs = require("ejs")
const htmlToText = require("html-to-text");
const appRoot = require ('app-root-path')

// Create A class for Send Any Email On Diffrent Subjects
module.exports = class Email {
    constructor(user, url='test.come') {
        this.user = user
        this.to = user.email;
        this.firstname = user.fullname;
        this.url = url;
        this.from = `Kando Weblog <${process.env.EMAIL_FROM}>`
    }
    // Create A transporter (Send Email Platform )
    newTransporter() {
        return nodeMailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            },
            tls:{
                rejectUnauthorized : false
            }
        })
    }
    //Create Send Function Based On Ejs template
    async send(template, subject) {
         const html = await ejs.renderFile(`${appRoot}/views/emails/${template}.ejs`, {
            firstname: this.firstname,
            url: this.url,
            subject,
            user : this.user
        })
        // Mail Options !
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }
        await this.newTransporter().sendMail(mailOptions)
    }
    // Create Welcome Email Function With Name Of template And Subject
    async sendWelcome() {
        await this.send("welcome", "welcome to our website")
    }
    async sendResetPassword(){
        await this.send("resetPassword", "your password reset token")
    }

    async sendContactUsEmail (){
        this.to  = process.env.CONTACT_US_EMAIL
        await this.send("contactUs" , "Email from website")
    }
}