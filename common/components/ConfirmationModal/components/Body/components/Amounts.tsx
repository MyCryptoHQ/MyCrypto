import React from 'react';
import { UnitDisplay } from 'components/ui';
import { Wei, TokenValue } from 'libs/units';
import { AppState } from 'reducers';
import ERC20 from 'libs/erc20';

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
    <React.Fragment>
      <p>
        Amount:{' '}
        <UnitDisplay
          decimal={decimal}
          value={handledValue}
          symbol={isToken ? unit : network.unit}
          checkOffline={false}
        />
      </p>
      <p>
        Transaction Fee:{' '}
        <UnitDisplay
          value={fee}
          unit="ether"
          symbol={network.unit}
          displayShortBalance={6}
          checkOffline={false}
        />
      </p>
      <p>
        Total:{' '}
        <UnitDisplay
          value={total}
          decimal={decimal}
          symbol={isToken ? unit : network.unit}
          checkOffline={false}
        />
      </p>
    </React.Fragment>
  );
};
