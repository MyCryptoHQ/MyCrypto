export const truncate = (children: string) => {
  return [children.substring(0, 15), '…', children.substring(children.length - 10)].join('');
};
