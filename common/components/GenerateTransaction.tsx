import { GenerateTransactionFactory } from './GenerateTransactionFactory';
import React from 'react';
import { translateRaw } from 'translations';

export const GenerateTransaction: React.SFC<{}> = () => (
  <GenerateTransactionFactory
    withProps={({ disabled, isWeb3Wallet, onClick }) => (
      <button disabled={disabled} className="btn btn-info btn-block" onClick={onClick}>
        {isWeb3Wallet ? translateRaw('SEND_generate') : translateRaw('DEP_signtx')}
      </button>
    )}
  />
);
