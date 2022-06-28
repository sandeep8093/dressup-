const nodemailer = require('nodemailer');

module.exports = (email, subject, otp) => {
  var transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: subject,
    html: `<p>OTP to verify your account</p><p>${otp}</p>`,
  };

  transporter.sendMail(mailOptions, function (info, error) {
    if (error) {
      return false;
    }
    if (info) {
      return true;
    }
  });
};
