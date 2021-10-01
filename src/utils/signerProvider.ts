import { hexlify } from '@ethersproject/bytes';
import { EnhancedStore } from '@reduxjs/toolkit';
import stringify from 'fast-json-stable-stringify';
import { sign, utils } from 'noble-ed25519';
import { WebsocketProvider } from 'web3-providers-ws';

import { incrementNonce } from '@store';
import { stripHexPrefix } from '@utils';

export const createSignerProvider = (store: EnhancedStore) => {
  const ws = new WebsocketProvider('ws://localhost:8000');

  const customProvider = {
    ...ws,
    send: async (payload: any, callback: any) => {
      const state = store.getState().signer;
      const id: number = state.nonce;
      store.dispatch(incrementNonce());

      // Use fast-json-stable-stringify as it is deterministic
      const encoded = Buffer.from(stringify({ ...payload, id }), 'utf-8');
      const hash = stripHexPrefix(hexlify(await utils.sha512(encoded)));
      const signature = await sign(hash, state.privateKey);
      const newPayload = { ...payload, id, signature, publicKey: state.publicKey };

      ws.send(newPayload, callback);
    }
  };

  return customProvider;
};
