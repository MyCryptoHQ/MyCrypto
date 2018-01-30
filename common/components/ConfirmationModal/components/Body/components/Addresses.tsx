import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';
import './Addresses.scss';

interface Props {
  to: string;
  rawTo: string;
  from: string;
  data: string;
  unit: string;
  isToken: boolean;
}

const size = '3rem';

export const Addresses: React.SFC<Props> = ({ from, to, rawTo, data, unit, isToken }) => {
  const toFormatted = unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to;
  return (
    <div className="tx-modal-address">
      <div className="tx-modal-address-from">
        <Identicon size={size} address={from} />
        <div>
          <h5>From </h5>
          <h5 className="small">{from}</h5>
        </div>
      </div>
      <div className="tx-modal-address-to">
        <Identicon size={size} address={toFormatted} />
        <div>
          <h5>To </h5>
          <h5 className="small">{toFormatted}</h5>
          {isToken && (
            <p className="small">
              └ via <a href={`https://etherscan.io/address/${rawTo}`}>{rawTo}</a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
