// emailVerifyCodeUtil.js
const crypto = require('crypto');

/**
 * 生成随机六位验证码
 * @returns {string} 生成的随机验证码
 */
function generateRandomCode() {
  // 生成一个随机数，取六位数部分
  const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
  return randomCode;
}

module.exports = {
  generateRandomCode
};
