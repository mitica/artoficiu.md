
import { createTransport, SendMailOptions } from 'nodemailer';
import config from './config';

const transporter = createTransport({
    service: 'Gmail',
    auth: {
        user: config.email,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: { rejectUnauthorized: false }
});

export function sendEmail(message: SendMailOptions) {
    message.from = message.from || config.email;
    return transporter.sendMail(message);
}
