import { createTransport } from 'nodemailer'

const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD.replace(' ', '')
    },
    secure: true,
    port: parseInt(process.env?.MAILER_PORT) ?? 465
});

async function sendMail(to: string, title: string, msg: string) {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: to,
        subject: title,
        text: msg
    })
}

export { sendMail }