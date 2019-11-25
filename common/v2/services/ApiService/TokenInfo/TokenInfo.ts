import { AxiosInstance, AxiosResponse } from 'axios';

import { default as ApiService } from '../ApiService';
import { TOKEN_INFO_URL } from 'v2/config';
import _ from 'lodash';

let instantiated: boolean = false;

export default class TokenInfoService {
  public static instance = new TokenInfoService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: TOKEN_INFO_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`TokenInfoService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getTokensInfo = async (contractAddresses: string[]) => {
    // Splices contract addresses for large sets of contracts to break up the calls into manageable chunks
    const splicedContractAddressArrays = spliceContractAddresses(contractAddresses);
    const paramsArray = splicedContractAddressArrays.map(contractAddressArray =>
      createParams(contractAddressArray)
    );

    try {
      return await Promise.all(
        paramsArray.map(async (params: any) => this.service.get('', { params }))
      ).then((returnedArray: AxiosResponse[]) =>
        _.union(...returnedArray.map(returnObject => returnObject.data))
      );
    } catch (e) {
      throw e;
    }
  };
}

const spliceContractAddresses = (contractAddresses: string[]): string[][] => {
  const lengthToSplitOn = 20;
  const splicedContractAddressArrays = [];
  do {
    splicedContractAddressArrays.push([...contractAddresses.splice(0, lengthToSplitOn)]);
  } while (contractAddresses.length >= lengthToSplitOn);

  splicedContractAddressArrays.push([...contractAddresses]);
  return splicedContractAddressArrays;
};

export const createParams = (contractAddresses: string[]) => {
  const params = new URLSearchParams();
  contractAddresses.forEach(address => params.append('contractAddress', address));
  return params;
};
