import has from 'lodash/has';

export function objectContainsObjectKeys(checkingObject, containingObject) {
  const checkingObjectKeys = Object.keys(checkingObject);
  const containsAll = checkingObjectKeys.map(key => has(containingObject, key));
  return containsAll.every(isTrue => isTrue);
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

export function getParam(query: { [key: string]: string }, key: string) {
  const keys = Object.keys(query);
  const index = keys.findIndex(k => k.toLowerCase() === key.toLowerCase());
  if (index === -1) {
    return null;
  }
  return query[keys[index]];
}

export function isPositiveInteger(n: number) {
  return Number.isInteger(n) && n > 0;
}
