import { hexlify } from '@ethersproject/bytes';
import { EnhancedStore } from '@reduxjs/toolkit';
import stringify from 'fast-json-stable-stringify';
import { sign, utils } from 'noble-ed25519';
import WebsocketProvider from 'web3-providers-ws';

import { getAppState, incrementNonce, setNonce } from '@store';
import { stripHexPrefix } from '@utils';

export const createSignerProvider = (store: EnhancedStore) => {
  // @ts-expect-error This is a valid constructor, not sure why it's failing
  const ws = new WebsocketProvider('ws://localhost:8000');

  const handleSend = async ({
    payload,
    callback,
    retryNonce
  }: {
    payload: any;
    callback(error: Error | null, result: any): void;
    retryNonce?: boolean;
  }) => {
    const state = getAppState(store.getState());
    const id: number = state.signer.nonce;
    const keyPair = state.signer.keyPair!;

    store.dispatch(incrementNonce());

    // Use fast-json-stable-stringify as it is deterministic
    const encoded = Buffer.from(stringify({ ...payload, id }), 'utf-8');
    const hash = stripHexPrefix(hexlify(await utils.sha512(encoded)));
    const signature = await sign(hash, keyPair.privateKey);
    const newPayload = { ...payload, id, signature, publicKey: keyPair.publicKey };

    const errorHandlingCallback = (error: Error | null, result: any) => {
      if (!retryNonce && result?.error && result?.error?.data?.expectedNonce) {
        const expectedNonce = result?.error?.data?.expectedNonce;
        // Correct request nonce and try again
        store.dispatch(setNonce(expectedNonce));
        return handleSend({ payload, callback, retryNonce: true });
      }
      callback(error, result);
    };

    ws.send(newPayload, errorHandlingCallback);
  };

  const customProvider = {
    ...ws,
    send: async (payload: any, callback: (error: Error | null, result: any) => void) => {
      return handleSend({ payload, callback, retryNonce: false });
    }
  };

  return customProvider;
};
