import * as commentRepository from '../repositories/commentRepository.js';
import * as bordRepository from '../repositories/bordRepository.js';
import BadRequestError from '../lib/errors/BadRequestError.js';
import NotFoundError from '../lib/errors/NotFoundError.js';
import ForbiddenError from '../lib/errors/ForbiddenError.js';

export const createComment = async ({ bordId, userId, content, parentId }) => {
  if (!content || content.trim() === '') {
    throw new BadRequestError('댓글 내용을 입력해주세요.');
  }

  // 게시글 존재 여부 확인
  const bord = await bordRepository.findBordById(bordId);
  if (!bord) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }

  let parentComment = null;
  if (parentId) {
    parentComment = await commentRepository.findCommentById(parentId);
    if (!parentComment || parentComment.bordId !== bordId) {
      throw new BadRequestError('유효하지 않은 부모 댓글입니다.');
    }
  }

  const created = await commentRepository.createComment({
    bordId,
    userId,
    content: content.trim(),
    parentId: parentId ?? null,
  });

  return created;
};

export const updateComment = async ({ commentId, userId, content }) => {
  if (!content || content.trim() === '') {
    throw new BadRequestError('댓글 내용을 입력해주세요.');
  }

  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('댓글 수정 권한이 없습니다.');
  }

  const updated = await commentRepository.updateComment(commentId, {
    content: content.trim(),
  });

  return updated;
};

export const deleteComment = async ({ commentId, userId }) => {
  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError('댓글 삭제 권한이 없습니다.');
  }

  await commentRepository.deleteCommentWithReplies(commentId);
};
