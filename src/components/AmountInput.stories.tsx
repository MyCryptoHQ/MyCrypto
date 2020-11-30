import React from 'react';

import { fAssets } from '@fixtures';

import { noOp } from '../utils';
import AmountInput from './AmountInput';

export default { title: 'AmountInput' };

const asset = fAssets[0]; // Ether

export const withText = () => <AmountInput asset={asset} value="123" onChange={noOp} />;

export const withPlaceholder = () => (
  <AmountInput asset={asset} value="" placeholder="Value" onChange={noOp} />
);
