export const normalizeText = (s) => {
  if (!s) return '';
  return s.replace(/\s+/g, '').toLowerCase();
};
