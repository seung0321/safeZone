import express from 'express';
import * as pathController from '../controllers/pathController.js'; // .js 확장자 필수!

const router = express.Router();

// 안심 귀가 경로 추천 API 엔드포인트
// URL: /api/path/recommend?startLat=...&startLon=...&endKeyword=...
router.get('/recommend', pathController.recommendPath);

export default router;