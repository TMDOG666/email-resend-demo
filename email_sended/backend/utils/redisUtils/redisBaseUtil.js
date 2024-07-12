const Redis = require('ioredis');
require('dotenv').config();

// 创建 Redis 客户端实例，并配置连接参数
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB
});

/**
 * 存储数据到 Redis 中
 * @param {string} key 存储数据的键
 * @param {string} value 存储数据的值
 * @param {number} [expiry] 过期时间（秒），可选
 * @returns {Promise} 存储操作的结果
 */
async function setData(key, value, expiry) {
  try {
    if (expiry) {
      await redis.set(key, value, 'EX', expiry); // 设置带有过期时间的数据
    } else {
      await redis.set(key, value); // 设置没有过期时间的数据
    }
    console.log(`Data set for key: ${key}`);
  } catch (err) {
    console.error(`Error setting data for key ${key}:`, err);
  }
}

/**
 * 从 Redis 中读取数据
 * @param {string} key 读取数据的键
 * @returns {Promise<string|null>} 读取的数据，如果不存在则返回 null
 */
async function getData(key) {
  try {
    const value = await redis.get(key);
    console.log(`Data retrieved for key: ${key}`);
    return value;
  } catch (err) {
    console.error(`Error getting data for key ${key}:`, err);
    return null;
  }
}

/**
 * 从 Redis 中删除数据
 * @param {string} key 删除数据的键
 * @returns {Promise} 删除操作的结果
 */
async function deleteData(key) {
  try {
    await redis.del(key);
    console.log(`Data deleted for key: ${key}`);
  } catch (err) {
    console.error(`Error deleting data for key ${key}:`, err);
  }
}

/**
 * 关闭 Redis 连接
 */
function closeConnection() {
  redis.disconnect();
}

module.exports = {
  setData,
  getData,
  deleteData,
  closeConnection
};
