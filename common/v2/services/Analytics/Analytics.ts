import { AxiosInstance } from 'axios';

import { ANALYTICS_API_URL, ANALYTICS_ID_SITE, ANALYTICS_REC } from './constants';
import { APIService } from '../API';
import { isDevelopment, isDesktop } from 'v2/utils';
import { Params, CvarEntry } from './types';

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

  public trackPageVisit(pageUrl: string): Promise<any> {
    const customParams: Params = {
      local: isDevelopment().toString(),
      desktop: isDesktop().toString()
    };

    const cvar: object = this.mapParamsToCvars(customParams);

    console.log('trackPageVisit');
    console.log(navigator.userAgent);

    const params: object = {
      action_name: 'Page navigation',
      url: pageUrl,
      idsite: ANALYTICS_ID_SITE,
      rec: ANALYTICS_REC,
      cvar: JSON.stringify(cvar)
    };

    return this.service.get('', { params }).catch();
  }

  private mapParamsToCvars(params: Params): object {
    console.log('mapParamsToCvars');

    return Object.keys(params).reduce((tempObject: CvarEntry, key, index) => {
      tempObject[index + 1] = [key, params[key].toString()];
      return tempObject;
    }, {});
  }
}
