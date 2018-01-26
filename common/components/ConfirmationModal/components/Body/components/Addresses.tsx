import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon, UnitDisplay } from 'components/ui';
import arrow from 'assets/images/tail-triangle-down.svg';
import BN from 'bn.js';

interface Props {
  to: string;
  from: string;
  amount: BN;
  data: string;
  networkUnit: string;
  unit: string;
  decimal: number;
  isToken: boolean;
}

const size = '3rem';

export const Addresses: React.SFC<Props> = ({
  from,
  to,
  amount,
  data,
  unit,
  networkUnit,
  decimal,
  isToken
}) => (
  <div className="Address">
    <div className="Address-from">
      <Identicon size={size} address={from} />
      <div>
        <h5>From: </h5>
        <h5 className="small">{from}</h5>
      </div>
    </div>
    <div className="Address-send-amount">
      <img src={arrow} alt="arrow down" />
      <div>
        <h5>Amount: </h5>
        <h5 className="small">
          <UnitDisplay
            decimal={decimal}
            value={amount}
            symbol={isToken ? unit : networkUnit}
            checkOffline={false}
          />
        </h5>
      </div>
    </div>
    <div className="Address-to">
      <Identicon size={size} address={to} />
      <div>
        <h5>To: </h5>
        <h5 className="small">{unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}</h5>
      </div>
    </div>
  </div>
);
