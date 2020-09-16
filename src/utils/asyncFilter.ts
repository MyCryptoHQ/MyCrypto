export const mapAsync = (array, fn) => {
  return Promise.all(array.map(fn));
};
export const filterAsync = (array, fn) => {
  return mapAsync(array, fn).then((_arr) => array.filter((v, i) => !!_arr[i]));
};
