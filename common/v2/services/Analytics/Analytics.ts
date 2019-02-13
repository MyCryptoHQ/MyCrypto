import { AxiosInstance } from 'axios';

import { ANALYTICS_API_URL, ANALYTICS_ID_SITE, ANALYTICS_REC } from './constants';
import { APIService } from '../API';
import { isDevelopment, isDesktop } from 'v2/utils';
import { CustomParams, CvarEntry } from './types';

let instantiated: boolean = false;
export default class AnalyticsService {
  public static instance = new AnalyticsService();

  private service: AxiosInstance = APIService.generateInstance({
    baseURL: ANALYTICS_API_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`AnalyticsService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public trackLegacy(category: string, eventName: string, eventParams?: object): void {
    this.track(category, `Legacy_${eventName}`, eventParams);
  }

  public track(category: string, eventName: string, eventParams?: object): void {
    const customParams: CustomParams = {
      local: isDevelopment().toString(),
      desktop: isDesktop().toString(),
      ...eventParams
    };

    const cvar: object = Object.keys(customParams).reduce((tempObject: CvarEntry, key, index) => {
      tempObject[index + 1] = [key, customParams[key].toString()];
      return tempObject;
    }, {});

    const params: object = {
      action_name: eventName,
      e_c: category,
      e_a: eventName,
      idsite: ANALYTICS_ID_SITE,
      rec: ANALYTICS_REC,
      cvar: JSON.stringify(cvar)
    };

    this.service.get('', { params }).catch();
  }
}
