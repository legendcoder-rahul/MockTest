import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import redis from '../config/cache.js'
import { sendMail } from '../service/mail.service.js'

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

export const getMe = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                username: user.username,
                targetExam: user.targetExam
            }
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
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

export const resetpassword = async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({ message: 'Email is required' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    // Store in Redis with 5 minutes (300 seconds) expiration
    await redis.set(`otp:${email}`, otp, 'EX', 300)

    try {
        await sendMail({
            to: email,
            subject: 'Reset Password OTP - MockTest',
            text: `Hi ${user.username}, your password reset OTP is ${otp}. It will expire in 5 minutes.`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: 0 auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #2563eb; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">ExamAI MockTest</h2>
                    </div>
                    <div style="border-top: 3px solid #2563eb; padding-top: 24px;">
                        <p style="font-size: 16px; color: #1f2937; margin-bottom: 16px;">Hello <strong>${user.username}</strong>,</p>
                        <p style="font-size: 15px; color: #4b5563; line-height: 1.5; margin-bottom: 24px;">We received a request to reset your password. Use the verification code below to complete the process. This code is valid for <strong>5 minutes</strong>.</p>
                        
                        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0;">
                            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #111827; font-family: monospace;">${otp}</span>
                        </div>
                        
                        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 24px;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
                        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
                        <p style="font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5; text-align: center;">This is an automated email, please do not reply directly.<br>&copy; MockTest Team. All rights reserved.</p>
                    </div>
                </div>
            `
        })

        res.status(201).json({
            message: 'OTP send successfully',
            success: true
        })
    } catch (error) {
        console.error("Error sending OTP email:", error)
        res.status(500).json({ message: 'Failed to send OTP email' })
    }
}

export const verifyOtpAndResetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required' })
    }

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    const storedOtp = await redis.get(`otp:${email}`)

    if (!storedOtp) {
        return res.status(400).json({ message: 'OTP expired or not found' })
    }

    if (storedOtp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    await user.save()

    await redis.del(`otp:${email}`)

    res.status(200).json({
        message: 'Password reset successfully',
        success: true
    })
}