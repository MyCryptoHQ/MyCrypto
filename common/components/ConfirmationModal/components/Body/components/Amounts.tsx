import React from 'react';
import { UnitDisplay } from 'components/ui';
import { Wei, TokenValue } from 'libs/units';
import { AppState } from 'reducers';
import ERC20 from 'libs/erc20';
import './Amounts.scss';

interface Props {
  value: string;
  gasPrice: string;
  gasLimit: string;
  network: AppState['config']['network'];
  decimal: number;
  unit: string;
  data: string;
}

export const Amounts: React.SFC<Props> = ({
  value,
  gasPrice,
  gasLimit,
  network,
  decimal,
  unit,
  data
}) => {
  const isToken = unit !== 'ether';
  const fee = Wei(gasPrice).mul(Wei(gasLimit));
  const handledValue = isToken ? TokenValue(ERC20.transfer.decodeInput(data)._value) : Wei(value);
  const total = fee.add(handledValue);
  return (
    <div className="Amount">
      <div className="Amount-send">
        <div className="Amount-send-positioning-wrapper">
          <h5>You'll Send: </h5>
          <h5>
            <UnitDisplay
              decimal={decimal}
              value={handledValue}
              symbol={isToken ? unit : network.unit}
              checkOffline={false}
            />
          </h5>
        </div>
      </div>
      <div className="Amount-fee">
        <div className="Amount-fee-positioning-wrapper">
          <h5>Transaction Fee: </h5>
          <h5>
            <UnitDisplay
              value={fee}
              unit="ether"
              symbol={network.unit}
              displayShortBalance={6}
              checkOffline={false}
            />
          </h5>
        </div>
      </div>
      <div className="Amount-total">
        <div className="Amount-total-positioning-wrapper">
          <h5>Total: </h5>
          <h5>
            <UnitDisplay
              value={total}
              decimal={decimal}
              symbol={isToken ? unit : network.unit}
              checkOffline={false}
            />
          </h5>
        </div>
      </div>
    </div>
  );
};
