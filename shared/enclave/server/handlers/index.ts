import { EnclaveMethodParams, EnclaveMethodResponse, EnclaveMethods } from 'shared/enclave/types';

import { displayAddress } from './displayAddress';
import { getChainCode } from './getChainCode';
import { signMessage } from './signMessage';
import { signTransaction } from './signTransaction';

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
