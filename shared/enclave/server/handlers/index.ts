import { EnclaveMethods, EnclaveMethodParams, EnclaveMethodResponse } from 'shared/enclave/types';
import { getChainCode } from './getChainCode';
import { signTransaction } from './signTransaction';
import { signMessage } from './signMessage';
import { displayAddress } from './displayAddress';

type EnclaveHandlers = {
  [key in EnclaveMethods]: (
    params: EnclaveMethodParams
  ) => EnclaveMethodResponse | Promise<EnclaveMethodResponse>;
};

const handlers: EnclaveHandlers = {
  [EnclaveMethods.GET_CHAIN_CODE]: getChainCode,
  [EnclaveMethods.SIGN_TRANSACTION]: signTransaction,
  [EnclaveMethods.SIGN_MESSAGE]: signMessage,
  [EnclaveMethods.DISPLAY_ADDRESS]: displayAddress
};

export default handlers;
