import { Addresses } from './Addresses';
import { Data } from './Data';
import { Node } from './Node';
import { AmountAndGasPrice } from './AmountAndGasPrice';
import { Nonce } from './Nonce';
import React from 'react';

export const Details: React.SFC<{}> = () => (
  <ul className="ConfModal-details">
    <Addresses />
    <Nonce />
    <AmountAndGasPrice />
    <Node />
    <Data />
  </ul>
);
