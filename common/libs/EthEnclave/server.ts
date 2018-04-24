import { createRpcProcessedEv, sendOnChannel } from './utils';
import {
  EnclaveEvents,
  RpcEventServer,
  RpcEventHandler,
  SignRawTransactionParams,
  RpcEventSuccess,
  SignRawTransaction
} from './types';
import { ipcMain } from 'electron';
import { createServerRpcHandler } from './server-utils';

/**
 * Contains the "server" implementation, currently only for electron
 * this should be run in ipcMain process to have access to node-hid
 * to perform signing actions for hardware wallets
 */

// mock
// this hard codes electron specific sending atm (ev.sender.send)
export const signRawTransactionRequest: RpcEventHandler<
  RpcEventServer<SignRawTransactionParams>,
  void
> = (ev: any, args) => {
  // "processing steps"
  // this is where you would sign the transaction
  const res: RpcEventSuccess<SignRawTransaction> = {
    payload: { r: '1', s: '1', v: '1' },
    id: args.id,
    errMsg: null
  };

  // emit result back to client as presonse
  // pull this out later on into server-utils
  const sendingChannel = createRpcProcessedEv(EnclaveEvents.SIGN_RAW_TRANSACTION);
  sendOnChannel(sendingChannel, res, ev, ev.sender.send);
};

// create the handler for SIGN_RAW_TRANSACTION
createServerRpcHandler(
  ipcMain,
  EnclaveEvents.SIGN_RAW_TRANSACTION,
  ipcMain.on,
  signRawTransactionRequest
);
