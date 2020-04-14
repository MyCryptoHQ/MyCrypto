import { withProtectTx } from 'v2/features/ProtectTransaction/components';
import ConfirmTransaction from 'v2/components/TransactionFlow/ConfirmTransaction';
import SignTransaction from './SignTransaction';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(ConfirmTransaction);
const SendAssetsFormWithProtectTx = withProtectTx(SendAssetsForm);

export {
  SignTransaction,
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
