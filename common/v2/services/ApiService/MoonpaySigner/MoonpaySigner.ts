import { AxiosInstance } from 'axios';

import { ApiService } from 'v2/services/ApiService';
import { MOONPAY_SIGNER_API } from 'v2/config/data';

let instantiated: boolean = false;

interface SignResponse {
  success: boolean;
  signature?: string;
}

export default class MoonpaySignerService {
  public static instance = new MoonpaySignerService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: MOONPAY_SIGNER_API,
    timeout: 5000
  });

  constructor() {
    if (instantiated) {
      throw new Error(`MoonpaySignerService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }
  public signUrlQuery(queryStringToSign: string) {
    return this.service
      .post('', {
        urlToSign: queryStringToSign
      })
      .then((res) => res.data)
      .then(({ success, signature }: SignResponse) => {
        if (!success) {
          console.debug('[MoonpaySignerService]: Signing failed');
        }
        return signature;
      })
      .catch((err) => {
        console.debug('[MoonpaySignerService]: Signing failed: ', err);
      });
  }
}
