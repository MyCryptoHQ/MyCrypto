import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';

interface Props {
  to: string;
  from: string;
  data: string;
  unit: string;
}

export const Addresses: React.SFC<Props> = ({ from, to, data, unit }) => (
  <React.Fragment>
    <Identicon size="32px" address={from} />
    <p>From: {from}</p>
    <Identicon size="32px" address={to} />
    <p>To: {unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}</p>
  </React.Fragment>
);
