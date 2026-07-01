import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import redis from '../config/cache.js'

// Token expiry constants
const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY = '7d'
const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000           // 15 minutes
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000 // 7 days
const REFRESH_TOKEN_REDIS_TTL = 7 * 24 * 60 * 60       // 7 days in seconds

// Generate access token (short-lived)
function generateAccessToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    })
}

// Generate refresh token (long-lived)
function generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    })
}

// Send both tokens as httpOnly cookies + store refresh token in Redis
export async function sendTokenResponse(user, res, message) {
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)

    // Store refresh token in Redis for validation & revocation
    await redis.set(
        `refreshToken:${user._id}`,
        refreshToken,
        'EX',
        REFRESH_TOKEN_REDIS_TTL
    )

    // Set httpOnly cookies
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: ACCESS_COOKIE_MAX_AGE
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: REFRESH_COOKIE_MAX_AGE
    })

    res.status(200).json({
        message,
        success: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            username: user.username,
            targetExam: user.targetExam
        }
    })
}

export const registerUser = async (req, res) => {
    const { username, email, password, contact, targetExam } = req.body

    const alreadyExist = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (alreadyExist) {
        return res.json({ message: 'User already exist' })
    }

    const hash = await bcrypt.hash(password, 10)

    if (!hash) {
        return res.json({ message: 'Failed to create password!' })
    }

    const newUser = await userModel.create({
        username,
        email,
        password: hash,
        contact,
        targetExam
    })

    if (!newUser) {
        return res.json({ message: 'Failed to create user' })
    }

    sendTokenResponse(newUser, res, 'user registered successfully')
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.json({ message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        return res.json({ message: 'Invalid password' })
    }

    sendTokenResponse(user, res, 'user logged in successfully')
}

// Issue new access token using valid refresh token
export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not provided' })
    }

    try {
        // Verify refresh token signature
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        // Check if refresh token exists in Redis (not revoked)
        const storedToken = await redis.get(`refreshToken:${decoded.id}`)

        if (!storedToken || storedToken !== refreshToken) {
            return res.status(401).json({ message: 'Refresh token is invalid or expired' })
        }

        // Issue new access token
        const newAccessToken = generateAccessToken(decoded.id)

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            maxAge: ACCESS_COOKIE_MAX_AGE
        })

        res.status(200).json({
            success: true,
            message: 'Access token refreshed successfully'
        })

    } catch (err) {
        return res.status(401).json({ message: 'Invalid refresh token' })
    }
}

export const logout = async (req, res) => {
    const { accessToken, refreshToken } = req.cookies

    // Blacklist current access token for its remaining TTL
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
            const remainingTTL = decoded.exp - Math.floor(Date.now() / 1000)
            if (remainingTTL > 0) {
                await redis.set(`blacklist:${accessToken}`, '1', 'EX', remainingTTL)
            }
        } catch (err) {
            // Token already expired, no need to blacklist
        }
    }

    // Delete refresh token from Redis
    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refreshToken:${decoded.id}`)
        } catch (err) {
            // Refresh token invalid/expired, ignore
        }
    }

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(200).json({ message: 'user logged out successfully' })
}