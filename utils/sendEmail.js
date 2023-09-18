const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'reagan.boehm@ethereal.email',
        pass: '4JYvNg2Vb3wMhnMtaq'
    }
});

const sendEmail = ({to, html, subject}) => {
    transporter.sendMail({
        from: '"Quiz App" <quizapp@gmail.com>',
        to,
        html,
        subject
    })
}

module.exports = sendEmail