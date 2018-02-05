import { GenerateTransactionFactory } from './GenerateTransactionFactory';
import React from 'react';
import translate from 'translations';

export const GenerateTransaction: React.SFC<{}> = () => (
  <GenerateTransactionFactory
    withProps={({ disabled, isWeb3Wallet, onClick }) => (
      <button disabled={disabled} className="btn btn-info btn-block" onClick={onClick}>
        {isWeb3Wallet ? translate('Send to MetaMask / Mist') : translate('DEP_signtx')}
      </button>
    )}
  />
);
