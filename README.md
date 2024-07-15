# 邮箱验证系统

该项目是一个邮箱验证系统，旨在通过邮件向用户发送验证码，使用 Redis 安全地存储验证码，并在用户输入验证码时进行验证。该系统还包括错误计数和邮箱锁定机制，以增强安全性和用户体验。

## 功能介绍

### 发送验证码邮件

- 通过 POST 请求发送验证码邮件，验证邮箱的接口。

- **URL**: `/emailVerification/send`
- **方法**: POST
- **参数**:
  - `email`: 用户邮箱地址
- **返回**:
  - 成功时，返回 `200` 状态码和消息 `验证码已发送，请查收邮件`。
  - 失败时，返回以下状态码和相应的错误消息：
    - `423 Locked`：邮箱已被锁定，请稍后再试。
    - `429 Too Many Requests`：验证码已发送，请检查您的邮箱，10分钟后可以再次发送。
    - `500 Internal Server Error`：服务维护中，请稍后再试。

### 验证邮箱验证码

- 通过 POST 请求验证用户输入的验证码。

- **URL**: `/emailVerification/verify`
- **方法**: POST
- **参数**:
  - `email`: 用户邮箱地址
  - `verificationCode`: 用户输入的验证码
- **返回**:
  - 成功时，返回 `200` 状态码和消息 `验证码验证成功`。
  - 失败时，返回以下状态码和相应的错误消息：
    - `423 Locked`：邮箱已被锁定，请10分钟后再试。
    - `410 Gone`：验证码已过期，请重新接收邮件。
    - `400 Bad Request`：验证码错误，请重新输入，还剩 {剩余次数} 次机会。
    - `500 Internal Server Error`：服务维护中，请稍后再试。
   

## 项目结构

- `controllers/emailVerificationController.js`: 处理验证码发送和验证的控制器。
- `routes/emailVerificationRoutes.js`: 定义 API 路由。
- `utils/redisUtils/redisEmailUtil.js`: 包含与 Redis 相关的邮箱验证实用工具函数。
- `utils/randomCodeUtils/emailVerifyCodeUtil.js`: 生成随机验证码的实用工具函数。
- `utils/emailUtils/verifyCodeSenderUtil.js`: 发送验证邮件的实用工具函数。
- `utils/emailUtils/emailSenderBaseUtil.js`: 基础邮件发送功能。

## 环境变量

确保在项目根目录下有一个 `.env` 文件，并包含以下配置：

```
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_DB=your_redis_db_number
EMAIL_HOST=your_email_host
RESEND_API_KEY=your_resend_api_key
```

## 使用方法

1. 克隆项目：

```bash
git clone https://github.com/TMDOG666/email-resend-demo.git
```

2. 进入项目目录：

```bash
cd backend
```

3. 安装依赖：

```bash
npm install
```

4. 运行项目：

```bash
npm run start
```

## 依赖项

- `express`: Node.js Web 应用框架。
- `dotenv`: 环境变量管理工具。
- `ioredis`: Redis 客户端。
- `crypto`: Node.js 加密模块。

## 注意事项

- 确保 Redis 服务器已正确配置并运行。
- 根据需求修改邮件模板和相关配置。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进该项目。

## 许可证

该项目采用 GPL 许可证。
