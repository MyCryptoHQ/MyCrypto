import {
  createSendAssetsForm,
  createConfirmTransactionComponent,
  SignTransaction,
  createTransactionReceipt
} from './components';

export const steps = [
  createSendAssetsForm,
  createConfirmTransactionComponent,
  SignTransaction,
  createTransactionReceipt
];

export const headings = [
  'Send Assets',
  'Confirm Transaction',
  'Sign Transaction',
  'Transaction Complete'
];
