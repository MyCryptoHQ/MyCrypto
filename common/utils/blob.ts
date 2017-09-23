export function makeBlob(mime: string, str: string | object) {
  str = typeof str === 'object' ? JSON.stringify(str) : str;
  if (str === null) {
    return '';
  }
  const blob = new Blob([str], {
    type: mime
  });
  return window.URL.createObjectURL(blob);
}
