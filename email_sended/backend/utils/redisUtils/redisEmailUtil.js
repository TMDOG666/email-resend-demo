const { setData, getData, deleteData } = require('./redisBaseUtil');

const EMAIL_ERROR_COUNT_PREFIX = 'emailErrorCount:';
const EMAIL_LOCK_PREFIX = 'emailLock:';

/**
 * 存储验证码到 Redis 中，并设置过期时间
 * @param {string} email 用户邮箱
 * @param {string} verificationCode 验证码
 * @param {string} extraInformation 额外信息
 * @param {number} expiresIn 过期时间（秒）
 * @returns {Promise} 存储操作的结果
 */
async function storeVerificationCode(email, verificationCode, extraInformation, expiresIn = 600) {
  try {
    const data = JSON.stringify({ verificationCode, extraInformation });
    await setData(email, data, expiresIn);
    return true;
  } catch (error) {
    console.error('Error storing verification code:', error);
    throw error;
  }
}

/**
 * 获取存储的验证码和签名
 * @param {string} email 用户邮箱
 * @returns {Promise} 存储的验证码和签名
 */
async function getVerificationCode(email) {
  try {
    const data = await getData(email);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting verification code:', error);
    throw error;
  }
}

/**
 * 删除存储的验证码和签名
 * @param {string} email 用户邮箱
 * @returns {Promise} 删除操作的结果
 */
async function deleteVerificationCode(email) {
  try {
    await deleteData(email);
    return true;
  } catch (error) {
    console.error('Error deleting verification code:', error);
    throw error;
  }
}

/**
 * 增加邮箱错误次数
 * @param {string} email 用户邮箱
 * @param {number} deadTime 结束时间 
 * @returns {Promise<number>} 当前的错误次数
 */
async function incrementEmailErrorCount(email, deadTime) {
  try {
    const key = EMAIL_ERROR_COUNT_PREFIX + email;
    let count = await getData(key);
    count = count ? parseInt(count) + 1 : 1;
    await setData(key, count, deadTime);
    return count;
  } catch (error) {
    console.error('Error incrementing email error count:', error);
    throw error;
  }
}

/**
 * 获取邮箱错误次数
 * @param {string} email 用户邮箱
 * @returns {Promise<number>} 当前的错误次数
 */
async function getEmailErrorCount(email) {
  try {
    const key = EMAIL_ERROR_COUNT_PREFIX + email;
    const count = await getData(key);
    return count ? parseInt(count) : 0;
  } catch (error) {
    console.error('Error getting email error count:', error);
    throw error;
  }
}

/**
 * 重置邮箱错误次数
 * @param {string} email 用户邮箱
 * @returns {Promise<boolean>} 重置操作的结果
 */
async function resetEmailErrorCount(email) {
  try {
    const key = EMAIL_ERROR_COUNT_PREFIX + email;
    await deleteData(key);
    return true;
  } catch (error) {
    console.error('Error resetting email error count:', error);
    throw error;
  }
}

/**
 * 锁定邮箱
 * @param {string} email 用户邮箱
 * @param {number} lockedTime 锁定时间
 * @returns {Promise<boolean>} 锁定操作的结果
 */
async function lockEmail(email, lockedTime) {
  try {
    const key = EMAIL_LOCK_PREFIX + email;
    await setData(key, true, lockedTime);
    return true;
  } catch (error) {
    console.error('Error locking email:', error);
    throw error;
  }
}

/**
 * 检查邮箱是否被锁定
 * @param {string} email 用户邮箱
 * @returns {Promise<boolean>} 邮箱锁定状态
 */
async function isEmailLocked(email) {
  try {
    const key = EMAIL_LOCK_PREFIX + email;
    const locked = await getData(key);
    return !!locked;
  } catch (error) {
    console.error('Error checking email lock status:', error);
    throw error;
  }
}

/**
 * 解锁邮箱
 * @param {string} email 用户邮箱
 * @returns {Promise<boolean>} 解锁操作的结果
 */
async function unlockEmail(email) {
  try {
    const key = EMAIL_LOCK_PREFIX + email;
    await deleteData(key);
    return true;
  } catch (error) {
    console.error('Error unlocking email:', error);
    throw error;
  }
}

module.exports = {
  storeVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
  incrementEmailErrorCount,
  getEmailErrorCount,
  resetEmailErrorCount,
  lockEmail,
  isEmailLocked,
  unlockEmail,
};
