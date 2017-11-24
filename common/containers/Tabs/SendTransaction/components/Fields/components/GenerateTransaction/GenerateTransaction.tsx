import React from 'react';
import { Wallet, Transaction } from 'components/renderCbs';
import translate from 'translations';

export const GenerateTransaction: React.SFC<{}> = () => (
  <Wallet
    withWallet={({ isWeb3Wallet }) => (
      <Transaction
        withTransaction={({ isFullTransaction }) => (
          <button
            disabled={!isFullTransaction}
            className="btn btn-info btn-block"
          >
            {isWeb3Wallet
              ? translate('Send to MetaMask / Mist')
              : translate('SEND_generate')}
          </button>
        )}
      />
    )}
  />
);

/* onClick={
                  isWeb3Wallet
                    ? this.generateWeb3TxFromState
                    : this.generateTxFromState
                }*/
