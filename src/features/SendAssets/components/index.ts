import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';
import ConfirmTransaction from '@components/TransactionFlow/ConfirmTransaction';
import SignTransaction from './SignTransaction';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(ConfirmTransaction);
const SendAssetsFormWithProtectTx = withProtectTx(SendAssetsForm);

export {
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
