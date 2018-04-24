import { EnclaveEvents, RpcEventHandler } from './types';

export const idGeneratorFactory = () => {
  let callId = 0;
  return () => {
    const currValue = callId;
    callId += 1;
    return currValue;
  };
};

export const createRpcRequestedEv = (e: EnclaveEvents) => `${e}-requested`;
export const createRpcProcessedEv = (e: EnclaveEvents) => `${e}-processed`;

type Resolve<T = any> = (value?: T | PromiseLike<T>) => void;
type Reject<T = any> = (reason?: T) => void;

export type ReceiveCb<Arguments = any, Ret = any> = (
  res: Resolve,
  rej: Reject,
  id?: number
) => RpcEventHandler<Arguments, Ret>;

export const receiveOnChannelFactory = <Arguments = any, Ret = any, K = any>(
  cb: ReceiveCb<Arguments, Ret>
) => (channel: string, target: any, on: any, id?: number): Promise<K> =>
  new Promise((res, rej) => on.call(target, channel, cb(res, rej, id)));

export const sendOnChannel = (
  channel: string,
  payload: any,
  target: any,
  emit: (args: any) => void
) => emit.call(target, channel, payload);
