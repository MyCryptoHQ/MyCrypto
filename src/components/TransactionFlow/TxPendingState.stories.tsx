import { ComponentProps } from 'react';

import { fNetwork, fTxReceiptEIP1559 } from '@fixtures';

import { TxPendingState } from './TxPendingState';

export default { title: 'Features/TxPendingState', components: TxPendingState };
const Template = (args: ComponentProps<typeof TxPendingState>) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxPendingState {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  network: fNetwork,
  txReceipt: fTxReceiptEIP1559
};
