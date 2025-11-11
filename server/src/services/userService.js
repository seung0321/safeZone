import * as userRepository from '../repositories/userRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';

export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) throw new NotFoundError('사용자를 찾을 수 없습니다.');
  const { password, refreshToken, ...profile } = user;
  return profile;
};

export const updateProfile = async (userId, data) => {
  const updated = await userRepository.updateUserInfo(userId, data);
  const { password, refreshToken, ...profile } = updated;
  return { message: '정보 수정 완료', profile };
};

export const deleteAccount = async (userId) => {
  await userRepository.deleteUser(userId);
  return { message: '회원 탈퇴 완료' };
};
