import * as commentService from '../services/commentService.js';

export const createComment = async (req, res, next) => {
  try {
    const bordId = Number(req.params.bordId);
    const userId = req.user.id; 
    const { content, parentId } = req.body;

    const created = await commentService.createComment({
      bordId,
      userId,
      content,
      parentId,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;
    const { content } = req.body;

    const updated = await commentService.updateComment({
      commentId,
      userId,
      content,
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentId = Number(req.params.commentId);
    const userId = req.user.id;

    await commentService.deleteComment({
      commentId,
      userId,
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
