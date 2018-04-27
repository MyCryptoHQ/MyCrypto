import getAddresses from './getAddresses';
import getChainCode from './getChainCode';
import signTransaction from './signTransaction';
import { EnclaveEvents, EventParams, EventResponse } from 'shared/enclave/types';

const handlers: {
  [key in EnclaveEvents]: (params: EventParams) => EventResponse | Promise<EventResponse>
} = {
  [EnclaveEvents.GET_ADDRESSES]: getAddresses,
  [EnclaveEvents.GET_CHAIN_CODE]: getChainCode,
  [EnclaveEvents.SIGN_TRANSACTION]: signTransaction
};

export default handlers;
