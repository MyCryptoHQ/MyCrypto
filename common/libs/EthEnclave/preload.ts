import { ipcRenderer } from 'electron';
import { EnclaveEvents, SignRawTransactionParams, SignRawTransaction } from './types';
import { createClientRpcHandler } from './client-utils';

const createElectronRpcHandler = <T = any, R = any>(channel: EnclaveEvents) =>
  createClientRpcHandler<T, R>(ipcRenderer, channel, ipcRenderer.send, ipcRenderer.once);

export const signRawTransaction = createElectronRpcHandler<
  SignRawTransactionParams,
  SignRawTransaction
>(EnclaveEvents.SIGN_RAW_TRANSACTION);
