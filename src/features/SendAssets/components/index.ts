import ConfirmTransaction from '@components/TransactionFlow/ConfirmTransaction';
import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';

import { SendAssetsForm } from './SendAssetsForm';
import SignTransaction from './SignTransaction';

export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(ConfirmTransaction);
const SendAssetsFormWithProtectTx = withProtectTx(SendAssetsForm, true);

export {
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
