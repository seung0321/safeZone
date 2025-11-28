import prisma from '../lib/utils/prismaClient.js';

export const findCommentById = async (id) => {
  return prisma.comment.findUnique({
    where: { id },
  });
};

export const createComment = async ({ bordId, userId, content, parentId }) => {
  return prisma.comment.create({
    data: {
      bordId,
      userId,
      content,
      parentId, 
    },
    select: {
      id: true,
      bordId: true,
      userId: true,
      content: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
      authorUser: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
};

export const updateComment = async (commentId, data) => {
  return prisma.comment.update({
    where: { id: commentId },
    data,
    select: {
      id: true,
      bordId: true,
      userId: true,
      content: true,
      parentId: true,
      createdAt: true,
      updatedAt: true,
      authorUser: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
};

export const deleteCommentWithReplies = async (commentId) => {
  await prisma.comment.deleteMany({
    where: {
      OR: [
        { id: commentId },
        { parentId: commentId },
      ],
    },
  });
};
