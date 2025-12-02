import axios from 'axios';

// 내 서버 주소 (로컬)
const SERVER_URL = 'http://localhost:3000/api/path/recommend';

async function testServer() {
    console.log("📡 [테스트 시작] 서버에 안심 경로를 요청합니다...");
    console.log("   👉 출발: 강남역 (37.498095, 127.027610)");
    console.log("   👉 도착: '교보타워' 검색");

    try {
        const response = await axios.get(SERVER_URL, {
            params: {
                startLat: 37.498095,   // 강남역 위도
                startLon: 127.027610,  // 강남역 경도
                endKeyword: "교보타워", // 목적지 검색어
                userId: "test_user_1"   // (선택) DB 저장 확인용
            }
        });

        // 결과 받기
        const data = response.data;

        if (data.success) {
            console.log("\n✅ [테스트 성공!] 서버가 응답했습니다.");
            console.log("------------------------------------------------");
            console.log(`📍 출발지: ${data.data.start.name}`);
            console.log(`🏁 도착지: ${data.data.end.name}`);
            console.log(`🏆 추천 경로 점수: ${data.data.bestPath.score}점`);
            console.log(`📏 총 거리: ${data.data.bestPath.summary.distance}m`);
            console.log(`⏱️ 소요 시간: ${(data.data.bestPath.summary.duration / 60).toFixed(1)}분`);
            
            const alerts = data.data.bestPath.alerts;
            if (alerts.length > 0) {
                console.log(`⚠️ 발견된 위험/경고 요소: ${alerts.join(', ')}`);
            } else {
                console.log(`🛡️ 특이사항 없는 안전한 경로입니다.`);
            }
            console.log("------------------------------------------------");
            console.log("💡 Tip: 이 데이터(data.bestPath.coordinates)를 지도에 그리면 끝입니다!");
        } else {
            console.log("❌ 서버 응답은 왔지만 실패했습니다:", data);
        }

    } catch (error) {
        console.error("\n❌ [테스트 실패] 서버와 연결할 수 없습니다.");
        console.error("   이유:", error.message);
        console.error("   💡 힌트: 'npm run start'로 서버를 먼저 켜두셨나요?");
    }
}

testServer();