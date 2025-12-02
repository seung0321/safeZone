import prisma from '../lib/utils/prismaClient.js';

export const findById = (id) =>
  prisma.user.findUnique({ where: { id } });

export const findByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

export const findByNickname = (nickname) =>
  prisma.user.findFirst({
    where: { nickname },
  });

export const create = (data) =>
  prisma.user.create({ data });

export const updateRefreshToken = (userId, refreshToken) =>
  prisma.user.update({ where: { id: userId }, data: { refreshToken } });

export const updatePassword = (userId, password) =>
  prisma.user.update({ where: { id: userId }, data: { password } });

export const updateUserInfo = (userId, data) =>
  prisma.user.update({ where: { id: userId }, data });

export const deleteUser = (userId) =>
  prisma.user.delete({ where: { id: userId } });

// Emergency contacts
export const findContactsByUser = (userId) =>
  prisma.emergencyContact.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

export const findContactById = (contactId) =>
  prisma.emergencyContact.findUnique({
    where: { id: contactId },
  });

export const findContactByPhone = (userId, phone) =>
  prisma.emergencyContact.findFirst({
    where: { userId, phone },
  });

export const createContact = ({ userId, name, phone }) =>
  prisma.emergencyContact.create({
    data: { userId, name, phone },
  });

export const updateContact = (contactId, data) =>
  prisma.emergencyContact.update({
    where: { id: contactId },
    data,
  });

export const deleteContact = (contactId) =>
  prisma.emergencyContact.delete({
    where: { id: contactId },
  });
