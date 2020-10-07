import ConfirmTransaction from '@components/TransactionFlow/ConfirmTransaction';
import { withProtectTx } from '@features/ProtectTransaction/components/WithProtectTx';
import { translateRaw } from '@translations';

import SendAssetsForm from './SendAssetsForm';
import SignTransaction from './SignTransaction';

export * from './validators';
export * from './fields';

const SignTransactionWithProtectTx = withProtectTx(SignTransaction);
const ConfirmTransactionWithProtectTx = withProtectTx(
  ConfirmTransaction,
  translateRaw('CONFIRM_TX_MODAL_TITLE')
);
const SendAssetsFormWithProtectTx = withProtectTx(
  SendAssetsForm,
  translateRaw('SEND_ASSETS'),
  true
);

export {
  SendAssetsForm,
  SignTransactionWithProtectTx,
  ConfirmTransactionWithProtectTx,
  SendAssetsFormWithProtectTx
};
