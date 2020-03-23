import { ToastConfigsProps, ToastType } from 'v2/types';

export const ToastTemplates = {
  addedAddress: 'added-address',
  failedTransaction: 'failed-transaction',
  pleaseReload: 'please-reload',
  offline: 'offline',
  somethingWentWrong: 'something-went-wrong',
  online: 'online',
  nodeConnectionError: 'node-connection-error'
};

export const toastConfigs: ToastConfigsProps = {
  [ToastTemplates.addedAddress]: {
    header: 'Success!',
    message: () => 'Address has been added to your address book.',
    type: ToastType.SUCCESS,
    position: 'top-left'
  },
  [ToastTemplates.failedTransaction]: {
    header: 'Error',
    message: () => 'Transaction didn’t go through. Please try again.',
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.pleaseReload]: {
    header: 'Error',
    message: () => 'Please reload the app or refresh the page',
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.offline]: {
    header: 'You’re offline.',
    message: () => 'Please check your internet connection and refresh the page.',
    type: ToastType.INFO,
    position: 'top-left'
  },
  [ToastTemplates.somethingWentWrong]: {
    header: 'We’re sorry.',
    message: () => 'Something went wrong! Please try again.',
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.online]: {
    header: 'You’re online!',
    message: () => 'All systems good to go.',
    type: ToastType.SUCCESS,
    position: 'top-left'
  },
  [ToastTemplates.nodeConnectionError]: {
    header: 'Node is offline!',
    message: () => 'The node you have selected is offline. Now connected to "Auto" node.',
    type: ToastType.ERROR,
    position: 'top-left'
  }
};
