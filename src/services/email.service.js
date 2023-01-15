const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const generateOTP = () => {
  digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// const sendEmail = async (to, subject, text) => {
//   const msg = { from: config.email.from, to, subject, text };
//   await transport.sendMail(msg);
// };

const sendEmail = async (to, mobile, subject, text) => {
  console.log(mobile);
  subject = "Don't share your otp";
  let otp = generateOTP();
  let link = `https://realestate.lotsmart.in/buyer#/verify-mail?mobile=${mobile}`;
  text = `Thank you For Register With Uyarchi, Click the Link To Verify Your Email : ${link}`;
  let msg = { from: config.email.from, to, subject, text, otp };
  await transport.sendMail(msg);
  return msg;
};

const sendEmailSeller = async (to, mobile, subject, text) => {
  console.log(mobile);
  subject = "Don't share your otp";
  let otp = generateOTP();
  let link = `https://realestate.lotsmart.in/Seller#/verify-mail?mobile=${mobile}`;
  text = `Thank you For Register With Uyarchi, Click the Link To Verify Your Email : ${link}`;
  let msg = { from: config.email.from, to, subject, text, otp };
  await transport.sendMail(msg);
  return msg;
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmailSeller,
};
