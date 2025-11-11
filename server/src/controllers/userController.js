import * as userService from '../services/userService.js';

export const getProfile = async (req, res, next) => {
  try {
    const result = await userService.getProfile(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const result = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const result = await userService.deleteAccount(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
