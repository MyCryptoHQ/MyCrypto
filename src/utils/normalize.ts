import uts46 from 'idna-uts46';

export function normalize(name: string): string {
  return uts46.toUnicode(name, { useStd3ASCII: true, transitional: false });
}

/**
 * Normalizes quotes in a (JSON) string. Certain operating systems may replace quotes with other quotes, which don't
 * work when parsing JSON.
 */
export const normalizeQuotes = (value: string): string => {
  return value.replace(/[“”]/g, '"');
};
