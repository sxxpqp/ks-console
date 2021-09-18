import redis from 'redis'
import { promisifyAll } from 'bluebird'

export const redisInit = ({ host, port, password }) => {
  const redisOptions = {
    host,
    port,
    password,
    no_ready_check: true,
    detect_buffers: true,
    retry_strategy(options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error('The server refused the connection')
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error('Retry time exhausted')
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        global.logApp('already tried 10 times!')
        return undefined
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000)
    },
  }

  // const client = redis. redis.createClient(options)
  let client = promisifyAll(redis.createClient(redisOptions))

  client.on('error', err => {
    global.logError.error(`Redis Client Error:${err}`)
    setTimeout(() => {
      if (!client.connected) {
        client = promisifyAll(redis.createClient(redisOptions))
      }
    }, 2000)
  })

  const setValue = (key, value, time) => {
    if (!client.connected) {
      client = promisifyAll(redis.createClient(redisOptions))
    }
    if (typeof value === 'undefined' || value == null || value === '') {
      return
    }
    if (typeof value === 'string') {
      if (typeof time !== 'undefined') {
        client.set(key, value, 'EX', time, (err, result) => {
          global.logError.error('client.set -> err', err, result)
        })
        // client.set(key, value);
        // client.expire(key, time);
      } else {
        client.set(key, value)
      }
    }
    // else if (typeof value === 'object') {
    //   // { key1: value1, key2: value2}
    //   // Object.keys(value) => [key1, key2]
    //   Object.keys(value).forEach(item => {})
    // }
  }

  const getValue = async key => {
    if (!client.connected) {
      client = promisifyAll(redis.createClient(redisOptions))
    }
    return await client.getAsync(key)
  }

  const getHValue = key => {
    // bluebird
    return client.hgetallAsync(key)
  }

  const delValue = key => {
    if (!client.connected) {
      client = promisifyAll(redis.createClient(redisOptions))
    }
    client.del(key, (err, res) => {
      if (res === 1) {
        global.logApp('delete successfully')
      } else {
        global.logError.error(`delete redis key error:${err}`)
      }
    })
  }
  return { client, setValue, getValue, getHValue, delValue }
}
