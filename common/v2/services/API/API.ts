import axios, { AxiosRequestConfig } from 'axios';

import { API_SERVICE_TIMEOUT, API_SERVICE_DEFAULT_HEADERS } from './constants';

export default class APIService {
  public static generateInstance = (config: AxiosRequestConfig = {}) =>
    axios.create({
      timeout: API_SERVICE_TIMEOUT,
      headers: {
        ...API_SERVICE_DEFAULT_HEADERS,
        ...(config.headers || {})
      },
      ...config
    });
}
