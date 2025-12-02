import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

// ES Module에서 __dirname 만들기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("-----------------------------------------");
console.log("👀 seed.js 스크립트가 시작되었습니다!");
console.log("-----------------------------------------");

const prisma = new PrismaClient();

// 1. 경로 및 파일 확인
const DATA_DIR = path.join(__dirname, '../data');
const CCTV_PATH = path.join(DATA_DIR, 'cctv_data.csv');
const LIGHT_PATH = path.join(DATA_DIR, 'light_data.csv');
// [추가됨] 범죄 데이터 파일 경로
const CRIME_PATH = path.join(DATA_DIR, 'crime_data.csv'); 

if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ 오류: 'data' 폴더가 없습니다! 예상 경로: ${DATA_DIR}`);
    process.exit(1);
}

// 2. CSV 읽기 함수들

// (A) 일반 시설물(CCTV, 가로등)용: 위도, 경도만 뽑음
function readCsvLatLon(filePath) {
    if (!fs.existsSync(filePath)) return [];
    try {
        const buf = fs.readFileSync(filePath);
        const csvText = buf.toString('utf-8').replace(/^\uFEFF/,'');
        const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });
        
        if (records.length === 0) return [];
        
        const keys = Object.keys(records[0]);
        const latKey = keys.find(k => k.includes('위도') || k.includes('lat') || k.includes('Lat'));
        const lonKey = keys.find(k => k.includes('경도') || k.includes('lon') || k.includes('Lon'));

        if (!latKey || !lonKey) return [];

        return records.map(r => ({
            lat: parseFloat(String(r[latKey]).replace(/[^0-9.\-]/g, '')),
            lon: parseFloat(String(r[lonKey]).replace(/[^0-9.\-]/g, ''))
        })).filter(p => !isNaN(p.lat) && !isNaN(p.lon));

    } catch (e) {
        console.error(`❌ CSV 읽기 에러 (${filePath}):`, e.message);
        return [];
    }
}

// (B) [추가됨] 범죄 데이터용: 주소, 유형, 날짜 등 상세 정보 뽑음
function readCrimeCsv(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ 경고: 범죄 데이터 파일이 없습니다 (${filePath})`);
        return [];
    }
    try {
        const buf = fs.readFileSync(filePath);
        const csvText = buf.toString('utf-8').replace(/^\uFEFF/,'');
        const records = parse(csvText, { columns: true, skip_empty_lines: true, trim: true });
        
        // 데이터 매핑 (CSV 헤더 이름에 맞춰 수정 필요)
        return records.map(data => ({
            district: data['자치구'] || '정보없음',
            address: data['안심 주소'] || data['주소'] || '정보없음',
            // 숫자로 변환
            latitude: parseFloat(data['위도']),
            longitude: parseFloat(data['경도']),
            type: data['범죄 유형'] || '기타',
            // 날짜 변환 (없으면 현재 시간)
            date: data['수정 일시'] ? new Date(data['수정 일시']) : new Date()
        })).filter(r => !isNaN(r.latitude) && !isNaN(r.longitude)); // 좌표 없는 불량 데이터 제거

    } catch (e) {
        console.error(`❌ 범죄 데이터 읽기 실패:`, e.message);
        return [];
    }
}

async function main() {
    console.log("🚀 데이터베이스 저장 작업 시작...");
    
    // 3. 초기화 (기존 데이터 삭제)
    try {
        await prisma.cctv.deleteMany();
        await prisma.light.deleteMany();
        // [추가됨] 범죄 데이터 초기화 (에러 방지용 try-catch)
        try { await prisma.crimeData.deleteMany(); } catch (e) {} 
        
        console.log("🧹 기존 데이터 삭제 완료 (초기화)");
    } catch (e) {
        console.error("❌ DB 연결 실패:", e.message);
        process.exit(1);
    }

    // 4. CCTV 저장
    const cctvData = readCsvLatLon(CCTV_PATH);
    if (cctvData.length > 0) {
        console.log(`📦 CCTV 데이터 ${cctvData.length}개 저장 중...`);
        // 대량 저장을 위해 createMany 사용
        await prisma.cctv.createMany({ data: cctvData }); 
    }

    // 5. 가로등 저장
    const lightData = readCsvLatLon(LIGHT_PATH);
    if (lightData.length > 0) {
        console.log(`📦 가로등 데이터 ${lightData.length}개 저장 중...`);
        await prisma.light.createMany({ data: lightData });
    }

    // 6. [추가됨] 범죄 데이터 저장
    const crimeData = readCrimeCsv(CRIME_PATH);
    if (crimeData.length > 0) {
        console.log(`📦 범죄 데이터 ${crimeData.length}개 저장 중...`);
        // SQLite 등 일부 DB는 skipDuplicates를 지원하지 않으므로 제거합니다.
        // 어차피 위에서 deleteMany로 초기화하므로 중복 문제는 없습니다.
        await prisma.crimeData.createMany({ 
            data: crimeData
        });
        console.log(`✅ 범죄 데이터 저장 완료!`);
    } else {
        console.log(`⚠️ 범죄 데이터가 없거나 0개입니다.`);
    }

    console.log("🎉 모든 작업이 성공적으로 끝났습니다!");
}

main()
    .catch((e) => {
        console.error("❌ 알 수 없는 에러 발생:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });