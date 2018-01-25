import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';
import './Addresses.scss';

interface Props {
  to: string;
  from: string;
  data: string;
  unit: string;
}

export const Addresses: React.SFC<Props> = ({ from, to, data, unit }) => (
  <div className="Address">
    <div className="Address-from">
      {/* <Identicon size="32px" address={from} /> */}
      <h5>From: </h5>
      <p>{from}</p>
    </div>
    <div className="Address-to">
      {/* <Identicon size="32px" address={to} /> */}
      <h5>To: </h5>
      <p>{unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}</p>
    </div>
  </div>
);
