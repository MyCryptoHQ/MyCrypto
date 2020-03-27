import { withProtectTx } from '../../features/ProtectTransaction/components';
import SignTransaction from '../../features/SendAssets/components/SignTransaction';

import { default as ConfirmTransaction } from './ConfirmTransaction';
import TxReceipt from './TxReceipt';
import MultiTxReceipt from './MultiTxReceipt';

const TxReceiptWithProtectTx = withProtectTx(TxReceipt, SignTransaction);

export {
  TxReceipt,
  TxReceiptWithProtectTx,
  ConfirmTransaction,
  MultiTxReceipt
};
