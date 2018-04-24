import {
  SignRawTransactionParams,
  ElectronInjectedGlobals,
  EnclaveEvents,
  SignRawTransaction
} from './types';
import { createClientRpcHandler } from './client-utils';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();
function isElectronEnv() {
  return process.env.BUILD_ELECTRON;
}

function getElectronWindow() {
  return window as ElectronInjectedGlobals;
}

export function signRawTransaction(params: SignRawTransactionParams) {
  // if we're in electron env then use the globally injected signRawTransaction from the preload script
  if (isElectronEnv) {
    const w = getElectronWindow();
    w.signRawTransaction(params);
  } else {
    // otherwise create an rpc event handler based on "events" package
    createClientRpcHandler<SignRawTransactionParams, SignRawTransaction>(
      eventEmitter,
      EnclaveEvents.SIGN_RAW_TRANSACTION,
      eventEmitter.emit,
      eventEmitter.on
    );
  }
}
