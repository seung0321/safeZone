import * as emailService from '../services/emailService.js';
import { validateSendCode, validateVerifyCode } from "../structs/emailStruct.js"

export const sendCode = async (req, res, next) => {
  try {
    validateSendCode(req.body);
    const {email, purpose} = req.body;
    const result = await emailService.sendVerificationCode(email, purpose);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    validateVerifyCode(req.body);
    const { email, code, purpose } = req.body;
    const result = await emailService.verifyCode(email, code, purpose);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
