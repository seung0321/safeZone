import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as commentController from '../controllers/commentController.js';

const router = express.Router();

// 댓글/대댓글 작성
router.post('/:bordId', authenticate, commentController.createComment);

// 댓글 수정
router.patch('/:commentId', authenticate, commentController.updateComment);

// 댓글 삭제
router.delete('/:commentId', authenticate, commentController.deleteComment);

export default router;
