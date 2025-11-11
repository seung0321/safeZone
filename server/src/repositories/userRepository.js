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
