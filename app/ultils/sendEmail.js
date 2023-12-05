const nodemailer = require('nodemailer');

const sendEmail = async (dataSendEmail) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'http://localhost:3000/',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: '"Optech" <info@optech.com>', // sender address
        to: dataSendEmail.to,
        subject: dataSendEmail.subject,
        text: dataSendEmail.text,
        html: dataSendEmail.html,
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;