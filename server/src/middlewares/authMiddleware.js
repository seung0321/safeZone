import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UnauthorizedError from '../lib/errors/UnauthorizedError.js';
dotenv.config();

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new UnauthorizedError('토큰이 없습니다.');

  const token = authHeader.split(' ')[1]?.trim();
  if (!token) throw new UnauthorizedError('토큰이 없습니다.');

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET); 
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    throw new UnauthorizedError('유효하지 않은 토큰입니다.');
  }
};
