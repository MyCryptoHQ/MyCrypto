import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';

import { default as ConfirmTransaction } from './ConfirmTransaction';
import MultiTxReceipt from './MultiTxReceipt';
import TxReceipt from './TxReceipt';

const TxReceiptWithProtectTx = withProtectTx(TxReceipt);

export { TxReceipt, TxReceiptWithProtectTx, ConfirmTransaction, MultiTxReceipt };
export { createSignConfirmAndReceiptSteps } from './helpers';
