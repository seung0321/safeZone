import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_EXPIRES = '1h';
const REFRESH_EXPIRES = '7d';
/**
 * 토큰 한 번에 생성
 * @param {number} userId
 * @returns { accessToken, refreshToken }
 */
export function generateTokens(userId) {
  const accessToken = jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
  return { accessToken, refreshToken };
}

/**
 * Refresh Token 검증
 * @param {string} token
 * @returns payload
 */
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw new Error('유효하지 않은 토큰입니다.');
  }
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    throw new Error('유효하지 않은 액세스 토큰입니다.');
  }
}
