import { ipcRenderer } from 'electron';
import { EnclaveEvents, SignRawTransactionParams, SignRawTransaction } from './types';
import { createClientRpcHandler } from './client-utils';

/**
 * Contains scripts to inject handlers into the web at runtime via preload
 * which "client" then can use to communicate with ipcMain process
 * to call methods on the enclave.
 * This package would be in the preload section of electron
 */

const createElectronRpcHandler = <T = any, R = any>(channel: EnclaveEvents) =>
  createClientRpcHandler<T, R>(ipcRenderer, channel, ipcRenderer.send, ipcRenderer.once);

export const signRawTransaction = createElectronRpcHandler<
  SignRawTransactionParams,
  SignRawTransaction
>(EnclaveEvents.SIGN_RAW_TRANSACTION);
