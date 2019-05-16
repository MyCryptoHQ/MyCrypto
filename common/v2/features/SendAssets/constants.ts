import {
  createSendAssetsForm,
  createConfirmTransactionComponent,
  createSignTransaction,
  createTransactionReceipt
} from './components';

export const steps = [
  createSendAssetsForm,
  createConfirmTransactionComponent,
  createSignTransaction,
  createTransactionReceipt
];

export const headings = [
  'Send Assets',
  'Confirm Transaction',
  'Sign Transaction',
  'Transaction Complete'
];
