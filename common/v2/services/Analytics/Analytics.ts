import { AxiosInstance } from 'axios';

import { ANALYTICS_API_URL, ANALYTICS_ID_SITE, ANALYTICS_REC } from './constants';
import { APIService } from '../API';

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

  public track(eventParams: object): void {
    const params: object = Object.assign(
      { idsite: ANALYTICS_ID_SITE, rec: ANALYTICS_REC },
      eventParams
    );

    this.service.get('', { params }).catch();
  }
}
