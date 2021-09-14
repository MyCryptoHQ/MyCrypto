import { ComponentProps } from 'react';

import { fNetwork, fTxConfig, fTxReceiptEIP1559 } from '@fixtures';
import { WalletId } from '@types';
import { noOp } from '@utils';

import { TxPendingState } from './TxPendingState';

export default { title: 'Features/TxPendingState', components: TxPendingState };
const Template = (args: ComponentProps<typeof TxPendingState>) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    <TxPendingState {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  network: { ...fNetwork, supportsEIP1559: true },
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.LEDGER_NANO_S_NEW }
  },
  txReceipt: fTxReceiptEIP1559,
  setLabel: noOp,
  showDetails: noOp
};

export const Web3 = Template.bind({});
Web3.args = {
  network: { ...fNetwork, supportsEIP1559: true },
  txConfig: fTxConfig,
  txReceipt: fTxReceiptEIP1559,
  setLabel: noOp,
  showDetails: noOp
};

export const MetaMask = Template.bind({});
MetaMask.args = {
  network: { ...fNetwork, supportsEIP1559: true },
  txConfig: {
    ...fTxConfig,
    senderAccount: { ...fTxConfig.senderAccount, wallet: WalletId.METAMASK }
  },
  txReceipt: fTxReceiptEIP1559,
  setLabel: noOp,
  showDetails: noOp
};
