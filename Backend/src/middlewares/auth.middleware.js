import jwt from 'jsonwebtoken'
import redis from './../config/cache.js'

async function authUser(req, res, next) {
    const token = req.cookies.accessToken

    if (!token) {
        return res.status(401).json({
            message: 'Access token not provided'
        })
    }

    // Check if token is blacklisted (logged out)
    const isBlacklisted = await redis.get(`blacklist:${token}`)

    if (isBlacklisted) {
        return res.status(401).json({
            message: 'Token has been revoked'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired access token'
        })
    }
}

export default authUser
