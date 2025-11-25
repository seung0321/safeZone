import * as bordRepository from '../repositories/bordRepository.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const getBordList = async ({ page, pageSize, category, searchType, keyword }) => {
  if (page <= 0 || pageSize <= 0) {
    throw new BadRequestError('page, pageSize는 1 이상의 정수여야 합니다.');
  }

  const skip = (page - 1) * pageSize;

  const { bords, totalCount } = await bordRepository.findBords({
    skip,
    take: pageSize,
    category,
    searchType,
    keyword,
  });

  return {
    items: bords,
    page,
    pageSize,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};

export const getBordDetail = async (bordId) => {
  const bord = await bordRepository.findBordById(bordId);
  if (!bord) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return bord;
};

export const createBord = async ({ userId, title, content, category }) => {
  if (!title || !content) {
    throw new BadRequestError('제목과 내용을 입력해주세요.');
  }

  if (!['inquiry', 'free', 'report'].includes(category)) {
    throw new BadRequestError('유효하지 않은 카테고리입니다.');
  }

  return bordRepository.createBord({
    userId,
    title,
    content,
    category,
  });
};

export const updateBord = async (bordId, userId, { title, content, category }) => {
  const bord = await bordRepository.findBordById(bordId);
  if (!bord) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }

  if (bord.userId !== userId) {
    throw new ForbiddenError('게시글 수정 권한이 없습니다.');
  }

  const data = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (category !== undefined) {
    if (!['inquiry', 'free', 'report'].includes(category)) {
      throw new BadRequestError('유효하지 않은 카테고리입니다.');
    }
    data.category = category;
  }

  return bordRepository.updateBord(bordId, data);
};

export const deleteBord = async (bordId, userId) => {
  const bord = await bordRepository.findBordById(bordId);
  if (!bord) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }

  if (bord.userId !== userId) {
    throw new ForbiddenError('게시글 삭제 권한이 없습니다.');
  }

  await bordRepository.deleteBord(bordId);
};
