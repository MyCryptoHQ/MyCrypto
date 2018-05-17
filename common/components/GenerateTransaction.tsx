import React from 'react';

import translate from 'translations';
import { SigningStatus } from 'components';
import { GenerateTransactionFactory } from './GenerateTransactionFactory';
import './GenerateTransaction.scss';

export const GenerateTransaction: React.SFC<{}> = () => (
  <React.Fragment>
    <GenerateTransactionFactory
      withProps={({ disabled, isWeb3Wallet, onClick }) => (
        <React.Fragment>
          <button
            disabled={disabled}
            className="btn btn-info btn-block GenerateTransaction"
            onClick={onClick}
          >
            {isWeb3Wallet ? translate('SEND_GENERATE') : translate('DEP_SIGNTX')}
          </button>
        </React.Fragment>
      )}
    />
    <SigningStatus />
  </React.Fragment>
);
