import { hexlify } from '@ethersproject/bytes';
import { EnhancedStore } from '@reduxjs/toolkit';
import stringify from 'fast-json-stable-stringify';
import { sign, utils } from 'noble-ed25519';
import { WebsocketProvider } from 'web3-providers-ws';

import { incrementNonce } from '@store';
import { stripHexPrefix } from '@utils';

export const createSignerProvider = (
  store: EnhancedStore,
  privateKey: string,
  publicKey: string
) => {
  const ws = new WebsocketProvider('ws://localhost:8000');

  const customProvider = {
    ...ws,
    send: async (payload: any, callback: any) => {
      const id: number = store.getState().signer.nonce;
      store.dispatch(incrementNonce());

      // Use fast-json-stable-stringify as it is deterministic
      const encoded = Buffer.from(stringify({ ...payload, id }), 'utf-8');
      const hash = stripHexPrefix(hexlify(await utils.sha512(encoded)));
      const signature = await sign(hash, privateKey);
      const newPayload = { ...payload, signature, publicKey };

      ws.send(newPayload, callback);
    }
  };

  return customProvider;
};
