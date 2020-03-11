import { withProtectTransaction } from '../../features/ProtectTransaction/components';
import SignTransaction from '../../features/SendAssets/components/SignTransaction';

export { default as ConfirmTransaction } from './ConfirmTransaction';
import TxReceipt from './TxReceipt';


const TxReceiptWithProtection = withProtectTransaction(TxReceipt, SignTransaction);

export {
  TxReceipt,
  TxReceiptWithProtection
}
