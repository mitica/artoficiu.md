
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
    return transporter.sendMail(message);
}
