import express from 'express';
import * as emailController from '../controllers/emaillController.js';

const router = express.Router();

router.post('/send', emailController.sendCode);
router.post('/verify', emailController.verifyCode);

export default router;
