import React from 'react';
import { Wallet, Transaction } from 'components/renderCbs';
import translate from 'translations';
import { WithSigner } from './Container';

export const GenerateTransaction: React.SFC<{}> = () => (
  <Wallet
    withWallet={({ isWeb3Wallet }) => (
      <Transaction
        withTransaction={({ isFullTransaction, transaction }) => (
          <WithSigner
            withSigner={signer => (
              <button
                disabled={!isFullTransaction}
                className="btn btn-info btn-block"
                onClick={signer(transaction)}
              >
                {isWeb3Wallet
                  ? translate('Send to MetaMask / Mist')
                  : translate('SEND_generate')}
              </button>
            )}
          />
        )}
      />
    )}
  />
);
