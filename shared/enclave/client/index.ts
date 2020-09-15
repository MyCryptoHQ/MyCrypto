import {
  DisplayAddressParams,
  DisplayAddressResponse,
  EnclaveMethodParams,
  EnclaveMethods,
  GetChainCodeParams,
  GetChainCodeResponse,
  SignMessageParams,
  SignMessageResponse,
  SignTransactionParams,
  SignTransactionResponse
} from 'shared/enclave/types';

import { makeRequest } from './requests';

function makeMethod<ParamsType extends EnclaveMethodParams, ResponseType>(method: EnclaveMethods) {
  return (params: ParamsType) => makeRequest<ResponseType>(method, params);
}

export class EnclaveAPIClass {
  public getChainCode = makeMethod<GetChainCodeParams, GetChainCodeResponse>(
    EnclaveMethods.GET_CHAIN_CODE
  );
  public signTransaction = makeMethod<SignTransactionParams, SignTransactionResponse>(
    EnclaveMethods.SIGN_TRANSACTION
  );
  public signMessage = makeMethod<SignMessageParams, SignMessageResponse>(
    EnclaveMethods.SIGN_MESSAGE
  );
  public displayAddress = makeMethod<DisplayAddressParams, DisplayAddressResponse>(
    EnclaveMethods.DISPLAY_ADDRESS
  );
}

export default new EnclaveAPIClass();
export * from 'shared/enclave/types';
