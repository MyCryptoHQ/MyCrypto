import { createRpcRequestedEv, receiveOnChannelFactory } from './utils';
import { EnclaveEvents, RpcEventServer } from './types';

// uses factory component, skips the promise handling and id parameter as those are only used on client side
// cb instead handles the receiving event, and on success/failure emits on EnclaveEvent channel with its response
const serverRecieve = <T = any>(cb: any) => receiveOnChannelFactory<RpcEventServer, T>(() => cb);

// create a receiving channel for incoming events of Enclave events type
// calls cb when a the channel has an event emitted to it
export const createServerRpcHandler = <T = any>(
  target: any,
  channel: EnclaveEvents,
  receiver: any,
  cb: any
) => {
  const receivingChannel = createRpcRequestedEv(channel);
  serverRecieve<T>(cb)(receivingChannel, target, receiver);
};
