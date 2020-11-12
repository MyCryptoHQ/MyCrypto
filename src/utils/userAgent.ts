export const isSafari = (userAgent: typeof navigator.userAgent) =>
  /^((?!chrome|android).)*safari/i.test(userAgent);
