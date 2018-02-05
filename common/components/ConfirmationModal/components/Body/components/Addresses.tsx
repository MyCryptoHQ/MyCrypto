import React from 'react';
import ERC20 from 'libs/erc20';
import { Identicon } from 'components/ui';
import arrow from 'assets/images/tail-triangle-down.svg';
import './Addresses.scss';
import { ETHAddressExplorer } from 'config';

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
  const toFormatted = isToken ? ERC20.transfer.decodeInput(data)._to : to;
  return (
    <div className="tx-modal-address">
      <div className="tx-modal-address-from">
        <Identicon className="tx-modal-address-from-icon" size={size} address={from} />
        <div className="tx-modal-address-from-content">
          <h5 className="tx-modal-address-from-title">From </h5>
          <h5 className="tx-modal-address-from-address small">{from}</h5>
        </div>
      </div>
      {isToken && (
        <div className="tx-modal-address-tkn-contract">
          <div className="tx-modal-address-tkn-contract-icon">
            <img src={arrow} alt="arrow" />
          </div>
          <div className="tx-modal-address-tkn-contract-content">
            <p className="tx-modal-address-tkn-contract-title">via the {unit} contract</p>
            <a
              className="small tx-modal-address-tkn-contract-link"
              href={ETHAddressExplorer(rawTo)}
            >
              {rawTo}
            </a>
          </div>
        </div>
      )}
      <div className="tx-modal-address-to">
        <Identicon className="tx-modal-address-from-icon" size={size} address={toFormatted} />
        <div className="tx-modal-address-to-content">
          <h5 className="tx-modal-address-to-title">To </h5>
          <h5 className="small tx-modal-address-to-address">{toFormatted}</h5>
        </div>
      </div>
    </div>
  );
};
