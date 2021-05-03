import { hexlify } from '@ethersproject/bytes';
import stringify from 'fast-json-stable-stringify';
import { sign, utils } from 'noble-ed25519';
import WebsocketProvider from 'web3-providers-ws';

import { stripHexPrefix } from '@utils';

export const createSignerProvider = (privateKey: string, publicKey: string) => {
  // @ts-expect-error This is a valid constructor, not sure why it's failing
  const ws = new WebsocketProvider('ws://localhost:8000');

  const customProvider = {
    ...ws,
    send: async (payload: any, callback: any) => {
      // Use fast-json-stable-stringify as it is deterministic
      const encoded = Buffer.from(stringify(payload), 'utf-8');
      const hash = stripHexPrefix(hexlify(await utils.sha512(encoded)));
      const signature = await sign(hash, privateKey);
      const newPayload = { ...payload, signature, publicKey };
      ws.send(newPayload, callback);
    }
  };

  return customProvider;
};
