// emailSenderBaseUtil.js
require('dotenv').config();
const { Resend } = require('resend');

// 初始化 Resend 实例
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * 发送邮件
 * @param {string} from 发件人邮箱
 * @param {string[]} to 收件人地址数组
 * @param {string} subject 邮件主题
 * @param {string} text 邮件正文
 * @returns {Promise} 发送邮件的结果
 */
async function sendEmail(from, to, subject, text) {
  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      text,
    });
    console.log('Email sent:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendEmail
};
