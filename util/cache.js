const client = require('./redisConfig');

module.exports = function cache(req, res, next) {
  console.log('cache invoked');
  client.getAsync('user:events')
    .then( data => data !== null ? res.send(data) : next() )
    .catch( err => res.status(500).send(err))
}