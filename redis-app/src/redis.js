const Redis = require("ioredis");
const {REDIS_PORT, REDIS_HOST} = require("./constants");
const redisClient = new Redis(REDIS_PORT, REDIS_HOST);

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports.redisClient = redisClient;