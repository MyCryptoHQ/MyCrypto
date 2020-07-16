import { translateRaw } from '@translations';
import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';
import ConfirmTransaction from '@components/TransactionFlow/ConfirmTransaction';

import SignTransaction from './SignTransaction';
import SendAssetsForm from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(
  ConfirmTransaction,
  translateRaw('CONFIRM_TX_MODAL_TITLE')
);
const SendAssetsFormWithProtectTx = withProtectTx(SendAssetsForm, translateRaw('SEND_ASSETS'));

export {
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
