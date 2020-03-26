import { withProtectTx } from 'v2/features/ProtectTransaction/components';
import ConfirmTransaction from 'v2/components/TransactionFlow/ConfirmTransaction';
import SignTransaction from './SignTransaction';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction, SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(ConfirmTransaction, SignTransaction);
const SendAssetsFormWithProtectTx = withProtectTx(SendAssetsForm, SignTransaction);

export {
  SignTransaction,
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
