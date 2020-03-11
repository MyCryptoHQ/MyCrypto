import { withProtectTransaction } from '../../ProtectTransaction/components';
import SignTransaction from './SignTransaction';
import { ConfirmTransaction } from '../../../components/TransactionFlow';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtection = withProtectTransaction(SignTransaction, SignTransaction);
const ConfirmTransactionWithProtection = withProtectTransaction(ConfirmTransaction, SignTransaction);
const SendAssetsFormWithProtection = withProtectTransaction(SendAssetsForm, SignTransaction);

export {
  SignTransaction,
  ConfirmTransaction,
  SendAssetsForm,
  SignTransactionWithProtection,
  ConfirmTransactionWithProtection,
  SendAssetsFormWithProtection
};
