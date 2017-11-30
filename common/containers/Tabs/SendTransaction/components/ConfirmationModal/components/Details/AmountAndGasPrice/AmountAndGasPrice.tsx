import { GasPrice } from './components';
import { Amount } from '../../Amount';
import React from 'react';

export const AmountAndGasPrice: React.SFC<{}> = () => (
  <li className="ConfModal-details-detail">
    <GasPrice />

    <p>
      You are sending{' '}
      <strong>
        <Amount />
      </strong>{' '}
    </p>
  </li>
);
