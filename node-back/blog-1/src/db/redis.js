const redis = require('redis')

const { REDIS_CONF }  = require('../config/db')

const redisClient =redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err => {
  console.log(err);
})

function set(key, value) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  redisClient.set(key, value, redis.print)
}

function get(key) {
  const promise = new Promise((resolve, reject) => {
    redisClient.get(key, (err, res) => {
      if (err) {
        reject(err)
        return
      }
      if (res === null) {
        resolve(null)
        return
      }

      try {
        resolve(JSON.parse(res))
      } catch (error) {
        resolve(res)
      }
    })
  })
  return promise
}

module.exports = {
  set,
  get
}