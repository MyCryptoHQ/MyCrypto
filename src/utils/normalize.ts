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

/**
 * Normalizes single quotes in a (JSON) string. Certain operating systems may replace quotes with other quotes, which
 * may not work when validating a signature.
 */
export const normalizeSingleQuotes = (value: string): string => {
  return value.replace(/[‘’]/g, "'");
};

/**
 * Attempts to parse a JSON string. If it fails (e.g. because the JSON is invalid), it normalizes the string and attempts
 * to parse it again.
 */
export const normalizeJson = <T>(value: string): T => {
  try {
    return JSON.parse(value);
  } catch {
    return JSON.parse(normalizeQuotes(value));
  }
};
