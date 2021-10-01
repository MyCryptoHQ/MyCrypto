import { hexlify } from '@ethersproject/bytes';
import { EnhancedStore } from '@reduxjs/toolkit';
import stringify from 'fast-json-stable-stringify';
import { sign, utils } from 'noble-ed25519';
import WebsocketProvider from 'web3-providers-ws';

import { getAppState, incrementNonce } from '@store';
import { stripHexPrefix } from '@utils';

export const createSignerProvider = (store: EnhancedStore) => {
  // @ts-expect-error This is a valid constructor, not sure why it's failing
  const ws = new WebsocketProvider('ws://localhost:8000');

  const customProvider = {
    ...ws,
    send: async (payload: any, callback: any) => {
      const state = getAppState(store.getState());
      const id: number = state.signer.nonce;

      store.dispatch(incrementNonce());

      // Use fast-json-stable-stringify as it is deterministic
      const encoded = Buffer.from(stringify({ ...payload, id }), 'utf-8');
      const hash = stripHexPrefix(hexlify(await utils.sha512(encoded)));
      const signature = await sign(hash, state.signer.keyPair!.privateKey);
      const newPayload = { ...payload, id, signature, publicKey: state.signer.keyPair!.publicKey };

      ws.send(newPayload, callback);
    }
  };

  return customProvider;
};
