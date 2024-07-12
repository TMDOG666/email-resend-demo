// mailSender.js
const { sendEmail } = require('./emailSenderBaseUtil');

/**
 * 正文模板
 * @param {string} to 收件人邮箱
 * @param {string} verificationCode 生成的验证码
 * @param {string} serviceProviderName 服务商名称 
 * @returns {string} 生成的正文模板
 */
const emailTemplate = (to, verificationCode, serviceProviderName) => `
尊敬的${to}，

您正在尝试注册我们的服务。请使用以下验证码完成邮箱验证：

${verificationCode}

请在10分钟内完成验证。如果您未请求此操作，请忽略此邮件。

祝您使用愉快！

${serviceProviderName}服务团队
`;

/**
 * 发送验证邮件
 * @param {string} from 发件人邮箱
 * @param {string} to 收件人邮箱
 * @param {string} verificationCode 验证码
 * @param {string} serviceProviderName 服务商名称
 * @returns {Promise} 发送邮件的结果
 */
async function sendVerificationEmail(from, to, verificationCode, serviceProviderName) {
  const subject = '邮箱验证';
  const text = emailTemplate(to, verificationCode, serviceProviderName);
  return await sendEmail(from, [to], subject, text);
}

module.exports = {
  sendVerificationEmail,
  emailTemplate
};
