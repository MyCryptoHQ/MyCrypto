import { AxiosInstance } from 'axios';

import { CUSTOM_ASSET_API } from '@config';
import { translateRaw } from '@translations';
import { NetworkId, TAddress, TUuid } from '@types';

import { default as ApiService } from '../ApiService';

let instantiated = false;

interface ICoinGeckoId {
  contractAddress: TAddress;
  networkId: NetworkId;
  uuid?: TUuid;
  coinGeckoId?: string;
}

export default class CustomAssetService {
  public static instance = new CustomAssetService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: CUSTOM_ASSET_API,
    timeout: 5000
  });

  constructor() {
    if (instantiated) {
      throw new Error(translateRaw('CUSTOM_ASSET_API_ERR'));
    } else {
      instantiated = true;
    }
  }

  public fetchCoingeckoID = (
    contractAddress: TAddress,
    networkId: NetworkId
  ): Promise<ICoinGeckoId> => {
    const input = {
      contractAddress,
      networkId
    };
    return this.service
      .post('', input)
      .then((res) => res.data as ICoinGeckoId)
      .catch((err) => {
        console.debug('[CustomAssetService]: Error fetching coingeckoid: ', err);
        return input;
      });
  };
}
