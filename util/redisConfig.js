const Promise = require('bluebird');
const redis = Promise.promisifyAll(require('redis'));
const REDIS_PORT = process.env.REDIS_PORT || 6379;
module.exports = client = redis.createClient(REDIS_PORT);