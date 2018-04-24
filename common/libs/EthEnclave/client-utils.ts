import {
  createRpcRequestedEv,
  createRpcProcessedEv,
  sendOnChannel,
  idGeneratorFactory,
  receiveOnChannelFactory
} from './utils';
import { EnclaveEvents, MatchingIdHandler, RpcEvent, RpcEventSuccess } from './types';
import { Reject, Resolve } from 'mycrypto-shepherd/dist/lib/types';

const genId = idGeneratorFactory();

const matchOnId = (id: number | undefined, cb: MatchingIdHandler) => (
  ev: string,
  args: RpcEvent
) => {
  if (id === args.id) {
    cb(ev, args);
  }
};

type PromiseHandler<T> = (res: Resolve, rej: Reject) => MatchingIdHandler<T>;

const isRpcSuccess = (args: RpcEvent): args is RpcEventSuccess => args.payload;

const handleServerResponse: PromiseHandler<RpcEvent> = (res, rej) => (_, args) => {
  if (isRpcSuccess(args)) {
    res(args.payload);
  } else {
    rej(args.errMsg);
  }
};

const clientRecieve = receiveOnChannelFactory((res, rej, id) =>
  matchOnId(id, handleServerResponse(res, rej))
);

export const createClientRpcHandler = <T = any, R = any>(
  target: any,
  channel: EnclaveEvents,
  sender: any,
  receiver: any
) => (payload: T): Promise<R> => {
  const id = genId();
  const sendingChannel = createRpcRequestedEv(channel);
  const receivingChannel = createRpcProcessedEv(channel);
  // send request event on channel to be processed by server
  sendOnChannel(sendingChannel, { payload, id }, target, sender);

  // return a promise that resolves/rejects when a matching id response comes back from server
  return clientRecieve(receivingChannel, id, target, receiver);
};
