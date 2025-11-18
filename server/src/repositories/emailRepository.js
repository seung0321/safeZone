import prisma from '../lib/utils/prismaClient.js';

export const saveCode = (email, code, purpose, expiresAt) =>
  prisma.emailVerification.create({
    data: { email, code, purpose, expiresAt }
  });

export const findCode = (email, purpose) =>
  prisma.emailVerification.findFirst({
    where: { email, purpose },
    orderBy: { createdAt: 'desc' },
  });

export const markVerified = (id) =>
  prisma.emailVerification.update({
    where: { id },
    data: { isVerified: true },
  });
