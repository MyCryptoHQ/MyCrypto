export const getFeaturedOS = (): string => {
  let OS: string = 'linux64';
  if (
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) ||
    navigator.appVersion.includes('Mac')
  ) {
    OS = 'mac';
  } else if (navigator.appVersion.includes('Win')) {
    OS = 'windows';
  }
  return OS;
};
