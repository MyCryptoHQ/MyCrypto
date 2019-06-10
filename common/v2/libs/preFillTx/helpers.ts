import * as qs from 'query-string';
import { queryParams } from './constants';
import { Param, queryObject } from './types';

export function isQueryTransaction(query: string): boolean {
  const params = getQueryTransactionData(query);
  const detectedQueryParams = queryParams.filter(param => {
    return !(param.toLowerCase() in params);
  });
  return detectedQueryParams.length > 0;
}

export function getQueryParamWithKey(queryObj: queryObject, key: Param): string | undefined {
  return queryObj[key];
}

export function getQueryParams(query: string): queryObject {
  const params: queryObject = getQueryTransactionData(query);
  return params;
}

export function getQueryTransactionData(query: string): queryObject {
  return qs.parse(query.toLowerCase());
}

export function isAdvancedQueryTransaction(query: string): boolean {
  const params = qs.parse(query.toLowerCase());
  if ('data' in params || 'gaslimit' in params || 'gasPrice' in params) {
    return true;
  } else {
    return false;
  }
}
