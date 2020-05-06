export const trimEllipsis = (str: string, maxLength: number): string => {
  if (!str || maxLength <= 0) {
    return '';
  }

  return str.length > maxLength ? `${str.substr(0, maxLength)}…` : str;
};
