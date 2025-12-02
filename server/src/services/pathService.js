import axios from 'axios';
import * as turf from '@turf/turf';
import RBush from 'rbush';
import * as facilityRepository from '../repositories/facilityRepository.js'; 
// crimeRepository import는 더 이상 필요 없습니다. (facilityRepository에 합쳤으니까요!)

// ⚠️ 본인의 카카오 API 키 (관리 주의)
const KAKAO_API_KEY = 'ee090b07b48bc6020cf13c0abf941e13'; 

const FACILITY_BUFFER_METERS = 25;
const SCORE_PER_CCTV = 3;    // CCTV 하나당 +3점 (안전)
const SCORE_PER_LIGHT = 3;   // 가로등 하나당 +3점 (안전)
const SCORE_PENALTY_CRIME = 10; // 범죄 발생지 하나당 -10점 (위험 회피)

// 데이터 캐싱 (서버 메모리에 보관)
let cctvTree = null;
let lightTree = null;
let crimeTree = null; 

// [내부 함수] 데이터 로드 (DB -> 메모리 R-Tree)
const loadFacilityData = async () => {
  // 이미 로드되어 있다면 DB 조회 건너뜀
  if (cctvTree && lightTree && crimeTree) return; 

  console.log("🔄 DB에서 시설물 및 범죄 데이터 로딩 중...");
  try {
    // [수정 포인트] 모든 데이터를 facilityRepository 하나에서 가져옵니다.
    const [cctvPts, lightPts, crimePts] = await Promise.all([
      facilityRepository.getAllCctvs(),
      facilityRepository.getAllLights(),
      facilityRepository.getAllCrimeData() // <-- 여기가 핵심! (crimeRepository 아님)
    ]);

    // R-Tree 인스턴스 생성
    cctvTree = new RBush();
    lightTree = new RBush();
    crimeTree = new RBush(); 

    // R-Tree 포맷으로 변환하여 적재
    cctvTree.load(cctvPts.map(p => ({ minX: p.lon, minY: p.lat, maxX: p.lon, maxY: p.lat, lat: p.lat, lon: p.lon })));
    lightTree.load(lightPts.map(p => ({ minX: p.lon, minY: p.lat, maxX: p.lon, maxY: p.lat, lat: p.lat, lon: p.lon })));
    
    // 범죄 데이터 적재
    // (주의: DB 컬럼명이 latitude/longitude라면 아래 코드가 맞습니다. seed.js와 일치)
    crimeTree.load(crimePts.map(p => ({ 
        minX: p.longitude, minY: p.latitude, 
        maxX: p.longitude, maxY: p.latitude, 
        lat: p.latitude, lon: p.longitude,
        type: p.type 
    })));
    
    console.log(`✅ R-Tree 구축 완료 (CCTV: ${cctvPts.length}, Light: ${lightPts.length}, Crime: ${crimePts.length})`);
  } catch (error) {
    console.error("❌ 데이터 로딩 실패:", error);
    // 에러 발생 시 서버가 죽지 않도록 빈 트리 생성
    cctvTree = new RBush(); 
    lightTree = new RBush();
    crimeTree = new RBush();
  }
};

// [내부 함수] 카카오 장소 검색 API
async function searchLocation(keyword) {
    try {
        const res = await axios.get("https://dapi.kakao.com/v2/local/search/keyword.json", {
            headers: { 'Authorization': `KakaoAK ${KAKAO_API_KEY}` },
            params: { query: keyword, size: 1 }
        });
        return res.data.documents[0] ? {
            name: res.data.documents[0].place_name,
            lat: parseFloat(res.data.documents[0].y),
            lon: parseFloat(res.data.documents[0].x)
        } : null;
    } catch (e) { return null; }
}

// [내부 함수] 카카오 도보 길찾기 API
async function fetchKakaoPaths(start, end) {
    try {
        const res = await axios.get("https://apis-navi.kakaomobility.com/v1/directions", {
            headers: { 'Authorization': `KakaoAK ${KAKAO_API_KEY}` },
            params: { 
                origin: `${start.lon},${start.lat}`, 
                destination: `${end.lon},${end.lat}`, 
                priority: "RECOMMEND", 
                alternatives: true 
            }
        });
        
        return res.data.routes.map((route, idx) => {
            const coords = [];
            route.sections.forEach(s => s.roads.forEach(r => {
                for(let i=0; i<r.vertexes.length; i+=2) coords.push([r.vertexes[i], r.vertexes[i+1]]);
            }));
            return { id: idx, summary: route.summary, coordinates: coords };
        });
    } catch (e) { return []; }
}

// [내부 함수] 안전 점수 계산 로직
function calculateScore(pathCoords) {
    const line = turf.lineString(pathCoords);
    const buffer = turf.buffer(line, FACILITY_BUFFER_METERS, { units: 'meters' });
    const bbox = turf.bbox(buffer);
    
    let score = 0;

    // 1. CCTV 점수
    const cctvs = cctvTree.search({ minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] });
    cctvs.forEach(c => {
        if(turf.booleanPointInPolygon(turf.point([c.lon, c.lat]), buffer)) score += SCORE_PER_CCTV;
    });

    // 2. 가로등 점수
    const hour = new Date().getHours();
    if(hour >= 18 || hour <= 6) {
        const lights = lightTree.search({ minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] });
        lights.forEach(l => {
            if(turf.booleanPointInPolygon(turf.point([l.lon, l.lat]), buffer)) score += SCORE_PER_LIGHT;
        });
    }

    // 3. 범죄 데이터 점수 (감점)
    const crimes = crimeTree.search({ minX: bbox[0], minY: bbox[1], maxX: bbox[2], maxY: bbox[3] });
    crimes.forEach(c => {
        if(turf.booleanPointInPolygon(turf.point([c.lon, c.lat]), buffer)) {
            score -= SCORE_PENALTY_CRIME; 
        }
    });

    return score;
}

// [내부 함수] 경로 상 위험 요소(경고) 추출
function getAlerts(pathCoords) {
    const alerts = [];
    for(let i=0; i<pathCoords.length; i+=10) {
        const pt = pathCoords[i];
        
        // 내 주변 50m 내 위험요소 확인
        const searchArea = { minX: pt[0]-0.0005, minY: pt[1]-0.0005, maxX: pt[0]+0.0005, maxY: pt[1]+0.0005 };
        
        // CCTV 확인
        const nearbyCCTV = cctvTree.search(searchArea);
        if(nearbyCCTV.length > 0) alerts.push("CCTV 구간");

        // 범죄 주의 확인
        const nearbyCrime = crimeTree.search(searchArea);
        if(nearbyCrime.length > 0) {
            alerts.push(`${nearbyCrime[0].type || '범죄'} 주의 구간`);
        }
    }
    return [...new Set(alerts)]; // 중복 제거
}

// [공개 함수] 메인 로직
export const getRecommendation = async (startLat, startLon, endKeyword) => {
    await loadFacilityData();

    const endCoord = await searchLocation(endKeyword);
    if (!endCoord) throw new Error("목적지를 찾을 수 없습니다.");

    const startCoord = { name: "현위치", lat: parseFloat(startLat), lon: parseFloat(startLon) };

    const paths = await fetchKakaoPaths(startCoord, endCoord);
    if (!paths.length) throw new Error("경로를 찾을 수 없습니다.");

    let bestPath = null;
    let maxScore = -Infinity;

    paths.forEach(p => {
        p.score = calculateScore(p.coordinates);
        if(p.score > maxScore) { maxScore = p.score; bestPath = p; }
    });

    return {
        start: startCoord,
        end: endCoord,
        bestPath: { 
            ...bestPath, 
            alerts: getAlerts(bestPath.coordinates) 
        },
        allPaths: paths
    };
};