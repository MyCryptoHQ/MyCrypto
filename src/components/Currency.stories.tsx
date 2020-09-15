import React from 'react';

import { Divider } from '@components';
import { FONT_SIZE } from '@theme';
import { TTicker, TUuid } from '@types';

import Currency from './Currency';

const defaultProps: React.ComponentProps<typeof Currency> = {
  amount: '0.00012312',
  ticker: 'USD' as TTicker
};

export default { title: 'Components/Currency' };

export const defaultState = () => {
  return (
    <div className="sb-container">
      <Currency amount={defaultProps.amount} ticker={defaultProps.ticker} />
      <Divider height={'1em'} />
      <Currency amount={defaultProps.amount} ticker={'ETH' as TTicker} />
      <Divider height={'1em'} />
      <Currency
        amount={defaultProps.amount}
        ticker={'ETH' as TTicker}
        icon={true}
        uuid={'dummy_id' as TUuid}
      />
      <Divider height={'1em'} />
      <Currency
        amount={defaultProps.amount}
        ticker={'ETH' as TTicker}
        icon={true}
        uuid={'dummy_id' as TUuid}
        bold={true}
      />
      <Divider height={'1em'} />
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
