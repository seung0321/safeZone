import * as authService from '../services/authService.js';
import { validateRegisterData, validateResetPasswordData } from '../structs/authStruct.js';

export const register = async (req, res, next) => {
  try {
    validateRegisterData(req.body)
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    if (!req.user) throw new UnauthorizedError('인증되지 않은 사용자입니다.');
    const result = await authService.logout(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new BadRequestError('리프레시 토큰이 필요합니다.');

    const result = await authService.refresh(refreshToken);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const findId = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.findId(email);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    validateResetPasswordData(req.body)
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
