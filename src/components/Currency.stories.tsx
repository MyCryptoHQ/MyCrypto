import { ComponentProps } from 'react';

import { FONT_SIZE } from '@theme';
import { TTicker, TUuid } from '@types';

import Currency from './Currency';
import Divider from './Divider';

const defaultProps: ComponentProps<typeof Currency> = {
  amount: '0.00012312',
  ticker: 'USD' as TTicker
};

export default { title: 'Molecules/Currency', component: Currency };

export const defaultState = () => {
  return (
    <div className="sb-container">
      <Currency amount={defaultProps.amount} ticker={defaultProps.ticker} />
      <Divider />
      <Currency amount={defaultProps.amount} ticker={'ETH' as TTicker} />
      <Divider />
      <Currency
        amount={defaultProps.amount}
        ticker={'ETH' as TTicker}
        icon={true}
        uuid={'dummy_id' as TUuid}
      />
      <Divider />
      <Currency
        amount={defaultProps.amount}
        ticker={'ETH' as TTicker}
        icon={true}
        uuid={'dummy_id' as TUuid}
        bold={true}
      />
      <Divider />
      <Currency
        amount={defaultProps.amount}
        ticker={'ETH' as TTicker}
        icon={true}
        uuid={'dummy_id' as TUuid}
        fontSize={FONT_SIZE.LG}
      />
    </div>
  );
};
