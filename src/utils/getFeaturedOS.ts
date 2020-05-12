import { OS } from '@config';

export const getFeaturedOS = (): string => {
  let featuredOS: string = OS.LINUX64;
  if (
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent) ||
    navigator.appVersion.includes('Mac')
  ) {
    featuredOS = OS.MAC;
  } else if (navigator.appVersion.includes('Win')) {
    featuredOS = OS.WINDOWS;
  }
  return featuredOS;
};
