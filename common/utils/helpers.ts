import qs from 'query-string';
import has from 'lodash/has';

interface IObjectValue {
  [key: string]: any;
}

export function objectContainsObjectKeys(
  checkingObject: IObjectValue,
  containingObject: IObjectValue
) {
  const checkingObjectKeys = Object.keys(checkingObject);
  const containsAll = checkingObjectKeys.map(key => has(containingObject, key));
  return containsAll.every(isTrue => isTrue);
}

export function getKeyByValue(object: IObjectValue, value: any) {
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

export function getParamFromURL(url: string, param: string): string | undefined {
  return qs.parse(qs.extract(url))[param];
}

export function isPositiveInteger(n: number) {
  return Number.isInteger(n) && n > 0;
}

export const getValues = (...args: any[]) =>
  args.reduce((acc, currArg) => [...acc, ...Object.values(currArg)], []);
