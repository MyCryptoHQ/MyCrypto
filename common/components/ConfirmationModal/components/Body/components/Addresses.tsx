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
  <div className="Address">
    <div className="Address-from">
      <div className="Address-from-positioning-wrapper">
        {/* <Identicon size="32px" address={from} /> */}
        <h5>From: </h5>
        <h5 className="small">{from}</h5>
      </div>
    </div>
    <div className="Address-to">
      <div className="Address-to-positioning-wrapper">
        {/* <Identicon size="32px" address={to} /> */}
        <h5>To: </h5>
        <h5 className="small">{unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}</h5>
      </div>
    </div>
  </div>
);
