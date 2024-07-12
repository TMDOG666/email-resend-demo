const {
    storeVerificationCode,
    getVerificationCode,
    deleteVerificationCode,
    incrementEmailErrorCount,
    resetEmailErrorCount,
    lockEmail,
    isEmailLocked,
} = require('../utils/redisUtils/redisEmailUtil');
const { generateRandomCode } = require('../utils/randomCodeUtils/emailVerifyCodeUtil');
const { sendVerificationEmail } = require('../utils/emailUtils/verifyCodeSenderUtil');
require('dotenv').config();

/**
 * 发送验证码邮件
 * @param {string} email 收件人邮箱
 * @returns {Promise} 发送邮件的结果
 */
exports.sendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // 检查是否已锁定邮箱
        if (await isEmailLocked(email)) {
            throw new Error('邮箱已被锁定，请稍后再试');
        }

        // 检查是否已经发送过验证码，防止重复发送
        const existingCode = await getVerificationCode(email);
        if (existingCode) {
            throw new Error('验证码已发送，请检查您的邮箱');
        }

        // 生成随机六位验证码
        const verificationCode = generateRandomCode();

        // 将验证码存入 Redis，设置过期时间为10分钟
        await storeVerificationCode(email, verificationCode, '', 600);

        // 发送验证邮件
        await sendVerificationEmail(process.env.EMAIL_HOST, email, verificationCode,  process.env.EMAIL_HOST);

        res.status(200).json({ message: '验证码已发送，请查收邮件' });
    } catch (error) {
        // 记录错误次数，并锁定邮箱
        const errorCount = await incrementEmailErrorCount(email);
        if (errorCount >= 3) {
            await lockEmail(email);
        }
        res.status(400).json({ message: error.message });
    }
};

/**
 * 验证邮箱验证码
 * @param {string} email 用户邮箱
 * @param {string} verificationCode 用户输入的验证码
 * @returns {Promise} 验证结果，验证成功返回 true，失败返回 false
 */
exports.verifyVerificationCode = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        // 检查是否已锁定邮箱
        if (await isEmailLocked(email)) {
            throw new Error('邮箱已被锁定，请10分钟后再试');
        }

        // 获取存储在 Redis 中的验证码
        const storedData = await getVerificationCode(email);
        if (!storedData) {
            throw new Error('验证码已过期，请重新接收邮件');
        }

        const storedVerificationCode = storedData.verificationCode;

        // 比对验证码
        if (verificationCode === storedVerificationCode) {
            // 验证成功，删除 Redis 中的验证码数据，并重置错误次数
            await deleteVerificationCode(email);
            await resetEmailErrorCount(email);
            res.status(200).json({ message: '验证码验证成功' });
        } else {
            // 验证失败，记录错误次数，并锁定邮箱
            const errorCount = await incrementEmailErrorCount(email, 600);
            if (errorCount >= 3) {
                await lockEmail(email, 600);
                throw new Error(`邮箱已锁定，请10分钟后再试`);
            }
            throw new Error(`验证码错误，请重新输入，还剩 ${3 - errorCount} 次机会`);

        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
