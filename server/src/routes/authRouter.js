import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import emailRouter from './emailRouter.js'

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.post('/refresh', authController.refresh);
router.post('/find-id', authController.findId);
router.post('/reset-password', authController.resetPassword);
router.use('/email', emailRouter);
export default router;
