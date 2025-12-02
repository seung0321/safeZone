import { object, string, pattern, size, optional, validate } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';

const phoneRegex = /^01[0-9]{8,9}$/;

const contactCreateSchema = object({
  name: size(string(), 1, 50),
  phone: pattern(string(), phoneRegex),
});

const contactUpdateSchema = object({
  name: optional(size(string(), 1, 50)),
  phone: optional(pattern(string(), phoneRegex)),
});

const getMessageForKey = (key) => {
  switch (key) {
    case 'name':
      return '이름을 입력해주세요.';
    case 'phone':
      return '정확한 핸드폰 번호를 입력해주세요.';
    default:
      return '입력값이 올바르지 않습니다.';
  }
};

export const validateContactCreateData = (data) => {
  const [error, value] = validate(data, contactCreateSchema);
  if (error) {
    const key = error?.path?.[0];
    throw new BadRequestError(getMessageForKey(key));
  }

  const trimmedName = value.name.trim();
  if (!trimmedName) {
    throw new BadRequestError('이름을 입력해주세요.');
  }

  return { name: trimmedName, phone: value.phone };
};

export const validateContactUpdateData = (data) => {
  if (data.name === undefined && data.phone === undefined) {
    throw new BadRequestError('수정할 값을 입력해주세요.');
  }

  const [error, value] = validate(data, contactUpdateSchema);
  if (error) {
    const key = error?.path?.[0];
    throw new BadRequestError(getMessageForKey(key));
  }

  const normalized = {};
  if (value.name !== undefined) {
    const trimmedName = value.name.trim();
    if (!trimmedName) {
      throw new BadRequestError('이름을 입력해주세요.');
    }
    normalized.name = trimmedName;
  }
  if (value.phone !== undefined) {
    normalized.phone = value.phone;
  }

  return normalized;
};
