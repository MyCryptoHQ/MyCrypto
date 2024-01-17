import axios, { AxiosRequestConfig } from 'axios';

import { API_SERVICE_DEFAULT_HEADERS, API_SERVICE_TIMEOUT } from './constants';

export default class ApiService {
  public static generateInstance = (config: AxiosRequestConfig = {}) =>
    axios.create({
      timeout: API_SERVICE_TIMEOUT,
      headers: {
        ...API_SERVICE_DEFAULT_HEADERS,
        ...(config.headers ?? {})
      },
      ...config
    });
}
