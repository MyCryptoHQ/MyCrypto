import { makeRequest } from './requests';
import {
  EnclaveMethods,
  EnclaveMethodParams,
  GetChainCodeParams,
  GetChainCodeResponse,
  SignTransactionParams,
  SignTransactionResponse,
  SignMessageParams,
  SignMessageResponse,
  DisplayAddressParams,
  DisplayAddressResponse
} from 'shared/enclave/types';

function makeMethod<ParamsType extends EnclaveMethodParams, ResponseType>(method: EnclaveMethods) {
  return (params: ParamsType) => makeRequest<ResponseType>(method, params);
}

const api = {
  getChainCode: makeMethod<GetChainCodeParams, GetChainCodeResponse>(EnclaveMethods.GET_CHAIN_CODE),
  signTransaction: makeMethod<SignTransactionParams, SignTransactionResponse>(
    EnclaveMethods.SIGN_TRANSACTION
  ),
  signMessage: makeMethod<SignMessageParams, SignMessageResponse>(EnclaveMethods.SIGN_MESSAGE),
  displayAddress: makeMethod<DisplayAddressParams, DisplayAddressResponse>(
    EnclaveMethods.DISPLAY_ADDRESS
  )
};

export default api;
export * from 'shared/enclave/types';
