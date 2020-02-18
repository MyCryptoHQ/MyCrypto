import { AxiosInstance } from 'axios';

import {
  ANALYTICS_API_URL,
  ANALYTICS_ID_SITE,
  ANALYTICS_ID_DESKTOP,
  ANALYTICS_REC
} from './constants';
import { VERSION } from 'config';
import { APIService } from '../API';
import { isDevelopment, isDesktop } from 'v2/utils';
import { Params, CvarEntry } from './types';

let instantiated: boolean = false;
export default class AnalyticsService {
  public static instance = new AnalyticsService();

  private service: AxiosInstance = APIService.generateInstance({
    baseURL: ANALYTICS_API_URL,
    timeout: 5000
  });

  constructor() {
    if (instantiated) {
      throw new Error(`AnalyticsService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public trackPageVisit(pageUrl: string, pathHash: string, network: string): Promise<any> {
    const customParamsView: Params = {
      local: isDevelopment().toString()
    };

    const customParamsVisit: Params = {
      node_id: network,
      platform: isDesktop() ? 'desktop app' : 'website',
      version: VERSION
    };

    const analyticsId = isDesktop() ? ANALYTICS_ID_DESKTOP : ANALYTICS_ID_SITE;

    const desktopString = 'https://desktop.app';
    const url = isDesktop() ? desktopString + pathHash.substr(1) : pageUrl;

    const params = {
      action_name: 'Page navigation',
      url,
      idsite: analyticsId,
      rec: ANALYTICS_REC,
      _cvar: JSON.stringify(this.mapParamsToCvars(customParamsVisit)),
      cvar: JSON.stringify(this.mapParamsToCvars(customParamsView))
    };

    return this.service.get('', { params }).catch();
  }

  private mapParamsToCvars(params: Params) {
    return Object.keys(params).reduce(
      (tempObject: CvarEntry, key, index) => {
        tempObject[index + 1] = [key, params[key].toString()];
        return tempObject;
      },
      {} as CvarEntry
    );
  }
}
