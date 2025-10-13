import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller';
import rateLimit from 'express-rate-limit';
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // 5 tentatives par IP
	message: { error: 'Trop de tentatives, réessayez plus tard.' }
});


const router = Router();
router.post('/register', register);
router.post('/login', loginLimiter, login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
