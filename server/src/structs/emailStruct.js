import { object, string, pattern, validate } from "superstruct";
import BadRequestError from "../lib/errors/BadRequestError.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendCodeSchema = object({
  email: pattern(string(), emailRegex),
  purpose: string()
});

export const validateSendCode = (data) => {
  const [error] = validate(data, sendCodeSchema);
  if (error) throw new BadRequestError("올바른 이메일 또는 목적이 아닙니다.");
};

const verifyCodeSchema = object({
  email: pattern(string(), emailRegex),
  code: string(),
  purpose: string()
});

export const validateVerifyCode = (data) => {
  const [error] = validate(data, verifyCodeSchema);
  if (error) throw new BadRequestError("인증 요청 형식이 잘못되었습니다.");
};