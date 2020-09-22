import React from 'react';

import { assets } from '../database/seed/assets';
import { noOp } from '../utils';
import AmountInput from './AmountInput';

export default { title: 'AmountInput' };

const asset = assets['f7e30bbe-08e2-41ce-9231-5236e6aab702']; // Ether

export const withText = () => <AmountInput asset={asset} value="123" onChange={noOp} />;

export const withPlaceholder = () => (
  <AmountInput asset={asset} value="" placeholder="Value" onChange={noOp} />
);
