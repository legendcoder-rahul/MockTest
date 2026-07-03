import { Router } from 'express'
import { registerUser, loginUser, logout, refreshAccessToken, getMe, resetpassword, verifyOtpAndResetPassword } from '../controllers/user.controller.js'
import authUser from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.get('/me', authUser, getMe)
router.post('/logout', authUser, logout)
router.post('/forget-password', resetpassword)
router.post('/reset-password', verifyOtpAndResetPassword)

export default router