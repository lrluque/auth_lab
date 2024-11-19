import nodemailer from 'nodemailer';
import {EMAIL, EMAIL_PASSWORD} from "../config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
    },
});

export class Mail {
    constructor() {
        this.mailOptions = {
            from: {
                address: EMAIL,
                name: "Auth Lab"
            },
            to: [],
            cc: [],
            bcc: [],
            attachments: []
        };
    }

    setCompanyName(name) {
        this.mailOptions.from.name = name;
    }

    setSenderEmail(email) {
        this.mailOptions.from.address = email;
    }

    setReceiver(receiver) {
        if (Array.isArray(receiver)) {
            this.mailOptions.to.push(...receiver);
        } else {
            this.mailOptions.to.push(receiver);
        }
    }

    setCC(cc) {
        if (Array.isArray(cc)) {
            this.mailOptions.cc.push(...cc);
        } else {
            this.mailOptions.cc.push(cc);
        }
    }

    setBCC(bcc) {
        if (Array.isArray(bcc)) {
            this.mailOptions.bcc.push(...bcc);
        } else {
            this.mailOptions.bcc.push(bcc);
        }
    }

    setSubject(subject) {
        this.mailOptions.subject = subject;
    }

    setText(text) {
        this.mailOptions.text = text;
    }

    setHTML(html) {
        this.mailOptions.html = html;
    }

    setAttachment(attachment) {
        if (Array.isArray(attachment)) {
            this.mailOptions.attachments.push(...attachment);
        } else {
            this.mailOptions.attachments.push(attachment);
        }
    }

    send() {
        return new Promise((resolve, reject) => {
            transporter.sendMail(this.mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

