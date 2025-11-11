import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * 비밀번호 해시 생성
 * @param {string} password
 * @returns {Promise<string>} 
 */
export async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 비밀번호 검증
 * @param {string} password 
 * @param {string} hash 
 * @returns {Promise<boolean>} 
 */
export async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
