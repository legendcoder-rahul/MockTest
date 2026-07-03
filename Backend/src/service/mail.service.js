import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
})

export async function sendMail({ to, subject, html, text }) {
    try {
        const info = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            text,
            html
        })

        console.log("email send:", info.response)
    } catch (error) {
        console.log('Error:', error)
        throw error
    }
}