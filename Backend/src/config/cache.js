import Redis from 'ioredis'

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    connectTimeout: 10000,
    maxRetriesPerRequest: 3
})

redis.on('connect', () => {
    console.log('server is connected to redis')
})

redis.on('error', (err) => {
    console.log('Redis error:', err.message)
})

export default redis