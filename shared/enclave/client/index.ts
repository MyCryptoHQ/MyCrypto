import { listenForResponses, makeRequestExpectingResponse } from './requests';
import {
  EnclaveEvents,
  GetAddressesParams,
  GetAddressesResponse,
  SignTransactionParams,
  SignTransactionResponse
} from 'shared/enclave/types';

export function registerClient() {
  listenForResponses();
}

const api = {
  getAddresses(params: GetAddressesParams) {
    return makeRequestExpectingResponse<GetAddressesResponse>(EnclaveEvents.GET_ADDRESSES, params);
  },

  signTransaction(params: SignTransactionParams) {
    return makeRequestExpectingResponse<SignTransactionResponse>(
      EnclaveEvents.SIGN_TRANSACTION,
      params
    );
  }
};

export default api;
