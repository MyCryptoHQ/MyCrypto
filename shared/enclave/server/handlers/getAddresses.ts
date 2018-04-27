import { GetAddressesParams, GetAddressesResponse } from 'shared/enclave/types';

export default function(params: GetAddressesParams): GetAddressesResponse {
  console.log('getAddresses called with', params);
  return {
    addresses: ['test1', 'test2', 'test3']
  };
}
