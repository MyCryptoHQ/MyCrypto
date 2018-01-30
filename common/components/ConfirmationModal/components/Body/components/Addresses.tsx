import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';

interface Props {
  to: string;
  from: string;
  data: string;
  unit: string;
  isToken: boolean;
  tknContractAddr: string;
}

const size = '3rem';

export const Addresses: React.SFC<Props> = ({
  from,
  to,
  data,
  unit,
  isToken,
  tknContractAddr = '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07'
}) => (
  <div className="tx-modal-address">
    <div className="tx-modal-address-from">
      <Identicon size={size} address={from} />
      <div>
        <h5>From: </h5>
        <h5 className="small">{from}</h5>
      </div>
    </div>
    <div className="tx-modal-address-to">
      <Identicon size={size} address={to} />
      <div>
        <h5>To: </h5>
        <h5 className="small">{unit === 'ether' ? to : ERC20.transfer.decodeInput(data)._to}</h5>
        {isToken && (
          <React.Fragment>
            <p className="small">
              └ via{' '}
              <span>
                <a href={`https://etherscan.io/address/${tknContractAddr}`}>{tknContractAddr}</a>
              </span>{' '}
            </p>
          </React.Fragment>
        )}
      </div>
    </div>
  </div>
);
