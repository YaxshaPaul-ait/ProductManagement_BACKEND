import { signUp, login, getUser } from '../controller/userController';
import express from 'express';
import { authenticate } from '../config/auth';
export const router = express.Router();

router.post('/login', login);
router.post('/signup', signUp);
router.get('/users', authenticate, getUser);

export default router;
