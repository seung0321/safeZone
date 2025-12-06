import * as pathService from '../services/pathService.js'; // .js 확장자 필수
import * as facilityRepository from '../repositories/facilityRepository.js'; // .js 확장자 필수

export const recommendPath = async (req, res) => {
  try {
    // ✨ 1. 클라이언트(앱)에서 endKeyword 대신 endLat와 endLon을 받습니다.
    const { startLat, startLon, endLat, endLon, userId } = req.query;

    // ✨ 2. 새로운 필수 정보가 없으면 에러를 응답합니다.
    if (!startLat || !startLon || !endLat || !endLon) {
      return res.status(400).json({ error: "필수 정보 누락: startLat, startLon, endLat, endLon이 필요합니다." });
    }

    // ✨ 3. 서비스에 새로운 파라미터를 전달합니다.
    const result = await pathService.getRecommendation(startLat, startLon, endLat, endLon);

    // 4. DB에 검색 기록 저장 (기존과 동일)
    if (userId) {
      facilityRepository.createHistory({
        userId,
        startName: result.start.name,
        endName: result.end.name, // '목적지'로 저장됨
        score: result.bestPath.score
      }).catch(err => console.error("⚠️ DB 검색 기록 저장 실패:", err));
    }

    // 5. 최종 결과 응답 (기존과 동일)
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("❌ 컨트롤러 에러:", error);
    // 서비스에서 발생한 오류 메시지를 그대로 클라이언트에게 전달
    res.status(500).json({ error: error.message });
  }
};