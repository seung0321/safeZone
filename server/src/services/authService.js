import * as userRepository from '../repositories/userRepository.js';
import { hashPassword, comparePassword } from '../lib/utils/bcrypt.js';
import { generateTokens, verifyRefreshToken } from '../lib/utils/jwt.js';
import { findCode } from '../repositories/emailRepository.js';
import ConflictError from '../lib/errors/ConflictError.js';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const register = async (data) => {
  const { name, nickname, email, password, phone } = data;

  const emailExisting = await userRepository.findByEmail(email);
  if (emailExisting) throw new ConflictError('이미 존재하는 이메일입니다.');

  const emailRecord = await findCode(email);
  if (!emailRecord || !emailRecord.isVerified)
    throw new BadRequestError('이메일 인증이 필요합니다.');

  const nicknameExisting = await userRepository.findByNickname(nickname);
  if (nicknameExisting) throw new ConflictError('이미 존재하는 닉네임입니다.');

  const hashed = await hashPassword(password);
  const user = await userRepository.create({
    name,
    nickname,
    email,
    password: hashed,
    phone,
  });
  const { accessToken, refreshToken } = generateTokens(user.id);
  await userRepository.updateRefreshToken(user.id, refreshToken);

  return { message: '회원가입 완료', tokens: { accessToken, refreshToken } };
};

export const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new NotFoundError('존재하지 않는 사용자입니다.');

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new UnauthorizedError('비밀번호가 일치하지 않습니다.');

  const { accessToken, refreshToken } = generateTokens(user.id);
  await userRepository.updateRefreshToken(user.id, refreshToken);

  return { message: '로그인 성공', tokens: { accessToken, refreshToken } };
};

export const logout = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('사용자를 찾을 수 없습니다.');

  await userRepository.updateRefreshToken(userId, null);

  return { message: '로그아웃이 완료되었습니다.' };
};

export const refresh = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new UnauthorizedError('리프레시 토큰이 만료되었거나 유효하지 않습니다.');
  }

  const user = await userRepository.findById(payload.userId);
  if (!user || user.refreshToken !== refreshToken)
    throw new UnauthorizedError('유효하지 않은 토큰입니다.');

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id);
  await userRepository.updateRefreshToken(user.id, newRefreshToken);
  return { message: '토큰 재발급 성공', tokens: { accessToken, refreshToken: newRefreshToken } };
};

export const findId = async (email) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new NotFoundError('등록된 이메일이 없습니다.');
  return { message: '이미 회원가입 된 이메일입니다.', name: user.name };
};

export const resetPassword = async ({ email, newPassword }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new NotFoundError('등록된 이메일이 없습니다.');

  const emailRecord = await findCode(email, 'reset_password');

  if (!emailRecord || !emailRecord.isVerified)
    throw new BadRequestError('비밀번호 재설정을 위한 이메일 인증이 필요합니다.');

  const hashed = await hashPassword(newPassword);
  await userRepository.updatePassword(user.id, hashed);
  return { message: '비밀번호가 재설정되었습니다.' };
};
