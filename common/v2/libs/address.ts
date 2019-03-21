export const truncate = (children: string): string => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};
