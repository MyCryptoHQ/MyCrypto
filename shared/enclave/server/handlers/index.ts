import getAddresses from './getAddresses';
import signTransaction from './signTransaction';
import { EnclaveEvents, EventParams, EventResponse } from 'shared/enclave/types';

const handlers: { [key in EnclaveEvents]: (params: EventParams) => EventResponse } = {
  [EnclaveEvents.GET_ADDRESSES]: getAddresses,
  [EnclaveEvents.SIGN_TRANSACTION]: signTransaction
};

export default handlers;
