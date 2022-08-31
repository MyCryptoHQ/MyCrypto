import { AxiosInstance } from 'axios';

import { MOONPAY_SIGNER_API } from '@config/data';
import { ApiService } from '@services/ApiService';

let instantiated = false;

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
