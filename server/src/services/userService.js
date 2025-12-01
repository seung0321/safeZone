import * as userRepository from '../repositories/userRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import {
  validateContactCreateData,
  validateContactUpdateData,
} from '../structs/userStruct.js';

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

export const getContacts = async (userId) => {
  return userRepository.findContactsByUser(userId);
};

export const createContact = async (userId, { name, phone }) => {
  const validated = validateContactCreateData({ name, phone });

  const duplicate = await userRepository.findContactByPhone(userId, validated.phone);
  if (duplicate) {
    throw new BadRequestError('이미 등록된 연락처 번호입니다.');
  }

  return userRepository.createContact({
    userId,
    name: validated.name,
    phone: validated.phone,
  });
};

export const updateContact = async (userId, contactId, { name, phone }) => {
  const contact = await userRepository.findContactById(contactId);
  if (!contact) {
    throw new NotFoundError('연락처를 찾을 수 없습니다.');
  }
  if (contact.userId !== userId) {
    throw new ForbiddenError('연락처 수정 권한이 없습니다.');
  }

  const data = validateContactUpdateData({ name, phone });

  if (data.phone !== undefined) {
    const duplicate = await userRepository.findContactByPhone(userId, data.phone);
    if (duplicate && duplicate.id !== contactId) {
      throw new BadRequestError('이미 등록된 연락처 번호입니다.');
    }
  }

  return userRepository.updateContact(contactId, data);
};

export const deleteContact = async (userId, contactId) => {
  const contact = await userRepository.findContactById(contactId);
  if (!contact) {
    throw new NotFoundError('연락처를 찾을 수 없습니다.');
  }
  if (contact.userId !== userId) {
    throw new ForbiddenError('연락처 삭제 권한이 없습니다.');
  }

  await userRepository.deleteContact(contactId);
  return { message: '연락처가 삭제되었습니다.' };
};
