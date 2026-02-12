export const safeYear = (raw?: string) => {
  if (!raw) return 'Unknown';
  const m = raw.match(/\b(19|20)\d{2}\b/);
  return m?.[0] || 'Unknown';
};
