import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticate, userController.getProfile);
router.patch('/me', authenticate, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteAccount);
router.get('/contacts', authenticate, userController.getContacts);
router.post('/contacts', authenticate, userController.createContact);
router.patch('/contacts/:contactId', authenticate, userController.updateContact);
router.delete('/contacts/:contactId', authenticate, userController.deleteContact);

export default router;
