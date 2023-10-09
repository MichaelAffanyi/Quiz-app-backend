const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'reagan.boehm@ethereal.email',
        pass: '4JYvNg2Vb3wMhnMtaq'
    }
});

const sendEmail = async ({to, html, subject}) => {
    await transporter.sendMail({
        from: '"Quiz App" <quizapp@gmail.com>',
        to,
        html,
        subject
    })

    // console.log(info)
}

module.exports = sendEmail