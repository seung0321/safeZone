import * as bordService from '../services/bordService.js';

export const getBordList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, category, searchType, keyword } = req.query;

    const result = await bordService.getBordList({
      page: Number(page),
      pageSize: Number(pageSize),
      category,
      searchType,
      keyword,
    });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const getBordDetail = async (req, res, next) => {
  try {
    const bordId = Number(req.params.bordId);
    const bord = await bordService.getBordDetail(bordId);
    res.status(200).json(bord);
  } catch (err) {
    next(err);
  }
};

export const createBord = async (req, res, next) => {
  try {
    const userId = req.user.id; // authenticate 미들웨어에서 세팅한 값
    const { title, content, category } = req.body;

    const created = await bordService.createBord({
      userId,
      title,
      content,
      category,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const updateBord = async (req, res, next) => {
  try {
    const bordId = Number(req.params.bordId);
    const userId = req.user.id;
    const { title, content, category } = req.body;

    const updated = await bordService.updateBord(bordId, userId, {
      title,
      content,
      category,
    });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteBord = async (req, res, next) => {
  try {
    const bordId = Number(req.params.bordId);
    const userId = req.user.id;

    await bordService.deleteBord(bordId, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
