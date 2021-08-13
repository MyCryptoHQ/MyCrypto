import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';
import { translateRaw } from '@translations';

import { default as ConfirmTransaction } from './ConfirmTransaction';
import MultiTxReceipt from './MultiTxReceipt';
import TxReceipt from './TxReceipt';

const TxReceiptWithProtectTx = withProtectTx(TxReceipt, translateRaw('TRANSACTION_BROADCASTED'));

export { TxReceipt, TxReceiptWithProtectTx, ConfirmTransaction, MultiTxReceipt };
export { default as SwapFromToDiagram } from './displays/SwapFromToDiagram';
export { createSignConfirmAndReceiptSteps } from './helpers';
