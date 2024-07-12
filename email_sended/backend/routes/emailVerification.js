const express = require('express');
const router = express.Router();
const emailVerificationController = require('../controllers/emailVerificationController');

// 发送验证码邮件
router.post('/send', emailVerificationController.sendVerificationCode);

// 验证邮箱验证码
router.post('/verify', emailVerificationController.verifyVerificationCode);

module.exports = router;
