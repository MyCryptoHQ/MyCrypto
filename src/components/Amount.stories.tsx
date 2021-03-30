import React from 'react';

import { Fiats } from '@config';

import AmountComponent from './Amount';

const props = {
  assetValue: '0.043',
  fiat: {
    amount: '230',
    symbol: Fiats['USD'].symbol,
    ticker: Fiats['USD'].ticker
  }
};

export default {
  title: 'Molecules/Amount',
  component: AmountComponent
};

const Template = (args: React.ComponentProps<typeof AmountComponent>) => (
  <AmountComponent {...args} />
);

export const Default = Template.bind({});
Default.storyName = 'Default';
Default.args = {
  ...props,
  bold: true,
  baseAssetValue: '0.043'
};

export const LeftAlign = Template.bind({});
LeftAlign.storyName = 'LeftAlign';
LeftAlign.args = {
  ...props,
  baseAssetValue: '0.043',
  alignLeft: true
};
