import { ComponentProps } from 'react';

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

import { Fiats } from '@config';
import { fAccounts, fBalances } from '@fixtures';
import { noOp } from '@utils';

import BalanceDetailsTableComponent from './BalanceDetailsTable';

export default {
  title: 'Organisms/BalanceDetailsTable',
  component: BalanceDetailsTableComponent,
  parameters: {
    //👇 The viewports object from the Essentials addon
    viewport: {
      //👇 The viewports you want to use
      viewports: INITIAL_VIEWPORTS
    }
  }
};
const Template = (args: ComponentProps<typeof BalanceDetailsTableComponent>) => (
  <BalanceDetailsTableComponent {...args} />
);

export const Desktop = Template.bind({});
Desktop.args = {
  balances: fBalances,
  accounts: fAccounts,
  fiat: Fiats.USD,
  selected: [],
  totalFiatValue: '1000',
  onHideAsset: noOp,
  firstAction: () => <div>Action</div>
};

export const Mobile = Template.bind({});
Mobile.parameters = {
  viewport: {
    defaultViewport: 'iphonex'
  }
};
Mobile.args = {
  balances: fBalances,
  accounts: fAccounts,
  fiat: Fiats.USD,
  selected: [],
  totalFiatValue: '1000',
  onHideAsset: noOp,
  firstAction: () => <div>Action</div>,
  isMobile: true
};
