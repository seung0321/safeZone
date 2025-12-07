// src/routes/mapRouter.js
import express from 'express';
import { getMapView } from '../controllers/mapController.js';

const router = express.Router();

// GET /map/view?coords=...
router.get('/view', getMapView);

export default router;
