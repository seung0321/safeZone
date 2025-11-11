import { object, string, size, pattern, refine, validate } from 'superstruct';
import BadRequestError from '../lib/errors/BadRequestError.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;

const registerSchema = refine(
  object({
    name: size(string(), 1, 10),             
    nickname: size(string(), 1, 15),        
    email: pattern(string(), emailRegex),
    address: size(string(), 1, 50),          
    password: pattern(string(), passwordRegex), 
    confirmPassword: string(),              
  }),
  'PasswordMatch',
  (value) => value.password === value.confirmPassword
);

export const validateRegisterData = (data) => {
  const [error] = validate(data, registerSchema);

  if (error) {
    const key = error?.path?.[0];
    let message = '입력값이 올바르지 않습니다.';

    switch (key) {
      case 'name':
        message = '이름은 1~10자 이내로 입력해야 합니다.';
        break;
      case 'nickname':
        message = '닉네임은 1~15자 이내로 입력해야 합니다.';
        break;
      case 'email':
        message = '이메일 형식이 올바르지 않습니다.';
        break;
      case 'address':
        message = '주소는 1~50자 이내로 입력해야 합니다.';
        break;
      case 'password':
        message = '비밀번호는 영문과 특수문자를 포함한 8~16자여야 합니다.';
        break;
      case 'confirmPassword':
        message = '비밀번호 확인을 입력해야 합니다.';
        break;
      case 'PasswordMatch':
        message = '비밀번호가 일치하지 않습니다.';
        break;
      default:
        message = error.message;
        break;
    }

    throw new BadRequestError(message);
  }
};

const resetPasswordSchema =refine(
  object({     
    email: pattern(string(), emailRegex),          
    newPassword: pattern(string(), passwordRegex), 
    confirmPassword: string(),              
  }),
  'PasswordMatch',
  (value) => value.newPassword === value.confirmPassword
);

export const validateResetPasswordData = (data) => {
  const [error] = validate(data, resetPasswordSchema);
  if (!error) return;

  let message = '입력값이 올바르지 않습니다.';

  if (error.refinement === 'PasswordMatch') {
    message = '비밀번호가 일치하지 않습니다.';
  } else {
    const key = error.path?.[0];

    switch (key) {
      case 'email':
        message = '이메일 형식이 올바르지 않습니다.';
        break;
      case 'newPassword':
        message = '비밀번호는 영문과 특수문자를 포함한 8~16자여야 합니다.';
        break;
      case 'confirmPassword':
        message = '비밀번호 확인을 입력해야 합니다.';
        break;
      default:
        message = error.message;
        break;
    }
  }

  throw new BadRequestError(message);
};
