import React from 'react';
import { NodeLib } from './NodeLib';
import { Wallet } from './Wallet';

interface Props {
  withNonce({
    nonce
  }: {
    nonce: string | null;
  }): React.ReactElement<any> | null;
}

export const Nonce: React.SFC<Props> = ({ withNonce }) => (
  <NodeLib
    withNodeLib={({ nodeLib }) => (
      <Wallet
        withWallet={({ wallet }) => {
          if (!wallet.inst) {
            return withNonce({ nonce: null });
          } else {
            return Promise.resolve(wallet.inst.getAddressString())
              .then(nodeLib.getTransactionCount)
              .then(nonce => withNonce({ nonce }));
          }
        }}
      />
    )}
  />
);
