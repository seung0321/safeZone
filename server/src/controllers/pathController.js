import * as pathService from '../services/pathService.js'; // .js 확장자 필수
import * as facilityRepository from '../repositories/facilityRepository.js'; // .js 확장자 필수

export const recommendPath = async (req, res) => {
  try {
    // 1. 클라이언트(앱)에서 보낸 데이터 받기
    const { startLat, startLon, endKeyword, userId } = req.query;

    // 필수 정보가 없으면 에러 응답
    if (!startLat || !startLon || !endKeyword) {
      return res.status(400).json({ error: "필수 정보 누락: startLat, startLon, endKeyword가 필요합니다." });
    }

    // 2. 서비스 호출 (핵심 길찾기 로직 실행)
    const result = await pathService.getRecommendation(startLat, startLon, endKeyword);

    // 3. DB에 검색 기록 저장 (로그인한 유저인 경우만)
    // 비동기(.catch)로 처리하여 응답 속도에 영향을 주지 않게 함
    if (userId) {
      facilityRepository.createHistory({
        userId,
        startName: result.start.name,
        endName: result.end.name,
        score: result.bestPath.score
      }).catch(err => console.error("⚠️ DB 검색 기록 저장 실패:", err));
    }

    // 4. 최종 결과 응답 (JSON)
    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("❌ 컨트롤러 에러:", error);
    res.status(500).json({ error: error.message });
  }
};