import { withProtectTx } from '../../features/ProtectTransaction/components';

import { default as ConfirmTransaction } from './ConfirmTransaction';
import TxReceipt from './TxReceipt';
import MultiTxReceipt from './MultiTxReceipt';

const TxReceiptWithProtectTx = withProtectTx(TxReceipt);

export { TxReceipt, TxReceiptWithProtectTx, ConfirmTransaction, MultiTxReceipt };
