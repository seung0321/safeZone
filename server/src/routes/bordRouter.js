import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import * as bordController from '../controllers/bordController.js';

const router = express.Router();

router.get('/', bordController.getBordList);
router.get('/:bordId', bordController.getBordDetail);
router.post('/', authenticate, bordController.createBord);
router.patch('/:bordId', authenticate, bordController.updateBord);
router.delete('/:bordId', authenticate, bordController.deleteBord);

export default router;
