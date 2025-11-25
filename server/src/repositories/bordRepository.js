import prisma from '../lib/utils/prismaClient.js';
import { normalizeText } from '../lib/utils/normalize.js';

export const findBords = async ({ skip, take, category, searchType, keyword }) => {
  const where = {};

  if (category) where.category = category;

  if (keyword && keyword.trim() !== '') {
    const trimmed = keyword.trim();
    const normalized = normalizeText(trimmed);

    if (searchType === 'title') {
      where.searchTitle = { contains: normalized };
    } else if (searchType === 'content') {
      where.searchContent = { contains: normalized };
    } else if (searchType === 'title_content') {
      where.OR = [
        { searchTitle: { contains: normalized } },
        { searchContent: { contains: normalized } },
      ];
    }else if (searchType === 'author') {
      where.authorUser = {
        is: {
          nickname: {
            contains: trimmed
          },
        },
      };
    }
  }

  const [bords, totalCount] = await Promise.all([
    prisma.bord.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        category: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        authorUser: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.bord.count({ where }),
  ]);

  return { bords, totalCount };
};

export const findBordById = async (bordId) => {
  return prisma.bord.findUnique({
    where: { id: bordId },
    include: {
      authorUser: {
        select: {
          id: true,
          nickname: true,
        },
      },
      comments: {
        where: { parentId: null },
        orderBy: { createdAt: 'asc' },
        include: {
          authorUser: {
            select: {
              id: true,
              nickname: true,
            },
          },
          replies: {
            orderBy: { createdAt: 'asc' },
            include: {
              authorUser: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const createBord = async ({ userId, title, content, category }) => {
  return prisma.bord.create({
    data: {
      userId,
      title,
      content,
      category,
      searchTitle: normalizeText(title),
      searchContent: normalizeText(content),
    },
  });
};

export const updateBord = async (bordId, data) => {
  const updateData = { ...data };

  if (data.title !== undefined) {
    updateData.searchTitle = normalizeText(data.title);
  }
  if (data.content !== undefined) {
    updateData.searchContent = normalizeText(data.content);
  }

  return prisma.bord.update({
    where: { id: bordId },
    data: updateData,
  });
};

export const deleteBord = async (bordId) => {
  await prisma.comment.deleteMany({
    where: { bordId },
  });

  await prisma.bord.delete({
    where: { id: bordId },
  });
};
