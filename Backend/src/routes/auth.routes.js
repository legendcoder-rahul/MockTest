import { Router } from 'express'
import { registerUser, loginUser, logout, refreshAccessToken } from '../controllers/user.controller.js'
import authUser from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/refresh', refreshAccessToken)
router.post('/logout', authUser, logout)

export default router