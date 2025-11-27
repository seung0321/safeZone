import { saveCode, findCode, markVerified } from '../repositories/emailRepository.js';
import {sendEmail} from '../lib/utils/email.js';
import BadRequestError from '../lib/errors/BadRequestError.js';

export const sendVerificationCode = async (email, purpose) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 3);

  await saveCode(email, code, purpose, expiresAt);

  const subject = '[SafeZone] 이메일 인증 코드 안내';
  const text = `요청하신 인증 코드는 ${code} 입니다.\n\n5분 이내에 입력해주세요.`;

  await sendEmail(email, subject, text);

  return { message: '인증코드가 이메일로 전송되었습니다.' };
};

export const verifyCode = async (email, code, purpose) => {
  const record = await findCode(email, purpose);
  if (!record) throw new BadRequestError('인증 정보가 없습니다.');

  if (record.code !== code) throw new BadRequestError('인증 코드가 일치하지 않습니다.');
  if (record.expiresAt < new Date()) throw new BadRequestError('인증 코드가 만료되었습니다.');

  await markVerified(record.id);

  return { message: '이메일 인증이 완료되었습니다.' };
};
