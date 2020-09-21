export const mapAsync = <T>(array: T[], fn: (arg: T) => Promise<any>) => {
  return Promise.all(array.map(fn));
};
export const filterAsync = <T>(array: T[], fn: (arg: T) => Promise<boolean>) => {
  return mapAsync(array, fn).then((_arr) => array.filter((_v, i) => !!_arr[i]));
};
