import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

router.post('/:bordId', authenticate, commentController.createComment);
router.patch('/:commentId', authenticate, commentController.updateComment);
router.delete('/:commentId', authenticate, commentController.deleteComment);

export default router;
