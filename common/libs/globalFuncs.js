export function makeBlob(mime, str) {
  str = typeof str === 'object' ? JSON.stringify(str) : str;
  if (str === null) return '';
  const blob = new Blob([str], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
}

export const scryptSettings = {
  n: 1024
};

export const kdf = 'scrypt';
