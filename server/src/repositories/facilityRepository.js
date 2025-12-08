import prisma from '../lib/utils/prismaClient.js';

// 1. 모든 CCTV 데이터 가져오기
export const getAllCctvs = async () => {
  return await prisma.cctv.findMany();
};

// 2. 모든 가로등 데이터 가져오기
export const getAllLights = async () => {
  return await prisma.light.findMany();
};

// 3. 모든 범죄 데이터 가져오기 (요청하신 대로 추가)
export const getAllCrimeData = async () => {
  // CrimeData 테이블에서 데이터 조회
  return await prisma.crimeData.findMany();
};

// 4. (보너스) 검색 기록 저장하기
// pathController.js에서 이 함수를 쓰고 있을 수 있어서 남겨두는 게 좋습니다.
export const createHistory = async (data) => {
  return await prisma.pathHistory.create({
    data: {
      userId: data.userId,
      startName: data.startName,
      endName: data.endName,
      score: data.score,
    },
  });
};