export const normalizeText = (s) => {
  if (!s) return '';
  return s.replace(/\s+/g, '').toLowerCase(); // 공백 제거 + 소문자
};
