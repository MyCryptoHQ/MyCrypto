import getAddresses from './getAddresses';
import getChainCode from './getChainCode';
import signTransaction from './signTransaction';
import signMessage from './signMessage';
import displayAddress from './displayAddress';
import { EnclaveMethods, EnclaveMethodParams, EnclaveMethodResponse } from 'shared/enclave/types';

const handlers: {
  [key in EnclaveMethods]: (
    params: EnclaveMethodParams
  ) => EnclaveMethodResponse | Promise<EnclaveMethodResponse>
} = {
  [EnclaveMethods.GET_ADDRESSES]: getAddresses,
  [EnclaveMethods.GET_CHAIN_CODE]: getChainCode,
  [EnclaveMethods.SIGN_TRANSACTION]: signTransaction,
  [EnclaveMethods.SIGN_MESSAGE]: signMessage,
  [EnclaveMethods.DISPLAY_ADDRESS]: displayAddress
};

export default handlers;
