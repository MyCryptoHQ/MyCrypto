import { TransactionFee } from './components';
import { Amount } from '../../Amount';
import React from 'react';

export const AmountAndGasPrice: React.SFC<{}> = () => (
  <li className="ConfModal-details-detail">
    <p>
      You are sending{' '}
      <strong>
        <Amount />
      </strong>{' '}
      with a transaction fee of{' '}
      <strong>
        <TransactionFee />
      </strong>
    </p>
  </li>
);
