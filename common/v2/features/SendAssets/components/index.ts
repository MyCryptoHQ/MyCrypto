import { withProtectTransaction } from 'v2/features/ProtectTransaction/components';
import ConfirmTransaction from 'v2/components/TransactionFlow/ConfirmTransaction';
import SignTransaction from './SignTransaction';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtection = withProtectTransaction(SignTransaction, SignTransaction);
const ConfirmTransactionWithProtection = withProtectTransaction(
  ConfirmTransaction,
  SignTransaction
);
const SendAssetsFormWithProtection = withProtectTransaction(SendAssetsForm, SignTransaction);

export {
  SignTransaction,
  SendAssetsForm,
  SignTransactionWithProtection,
  ConfirmTransactionWithProtection,
  SendAssetsFormWithProtection
};
