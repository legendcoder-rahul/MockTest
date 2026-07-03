import { Router } from 'express'
import { registerUser, loginUser, logout, refreshAccessToken, getMe, resetpassword, verifyOtpAndResetPassword, googleCallback } from '../controllers/user.controller.js'
import authUser from '../middlewares/auth.middleware.js'
import passport  from 'passport'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.get('/me', authUser, getMe)
router.post('/logout', authUser, logout)
router.post('/forget-password', resetpassword)
router.post('/reset-password', verifyOtpAndResetPassword)

router.get('/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', 
    passport.authenticate('google', {session: false, 
        failureRedirect: `http://localhost:3000/api/v1/auth/login`}),
    googleCallback
)
export default router