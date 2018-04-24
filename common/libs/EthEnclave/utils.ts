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

export type ReceiveCb<Arguments, Ret> = (
  res: Resolve,
  rej: Reject,
  id?: number
) => RpcEventHandler<Arguments, Ret>;

export const receiveOnChannelFactory = <CbArgs = any, CbRet = any, Ret = any>(
  cb: ReceiveCb<CbArgs, CbRet>
) => (channel: string, target: any, on: any, id?: number): Promise<Ret> =>
  new Promise((res, rej) => on.call(target, channel, cb(res, rej, id)));

export const sendOnChannel = (
  channel: string,
  payload: any,
  target: any,
  emit: (args: any) => void
) => emit.call(target, channel, payload);
