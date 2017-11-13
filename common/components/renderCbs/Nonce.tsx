import React from 'react';
import { NodeLib } from './NodeLib';
import { Wallet } from './Wallet';
import { Offline } from './Offline';

interface Props {
  withNonce({
    nonce
  }: {
    nonce: Promise<string | null>;
  }): React.ReactElement<any> | null;
}

const nullPromise = { nonce: Promise.resolve(null) };
export const Nonce: React.SFC<Props> = ({ withNonce }) => {
  const nonceGetter = (
    <NodeLib
      withNodeLib={({ nodeLib }) => (
        <Wallet
          withWallet={({ wallet }) => {
            if (!wallet.inst) {
              return withNonce(nullPromise);
            } else {
              const noncePromise = Promise.resolve(
                wallet.inst.getAddressString()
              )
                .then(nodeLib.getTransactionCount)
                .catch(_ => null);
              return withNonce({ nonce: noncePromise });
            }
          }}
        />
      )}
    />
  );

  return (
    <Offline
      withOffline={({ offline }) =>
        offline ? withNonce(nullPromise) : nonceGetter
      }
    />
  );
};
