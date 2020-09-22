import { translateRaw } from '@translations';
import { ToastConfigsProps, ToastType } from '@types';

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
    header: translateRaw('TOAST_SUCCESS'),
    message: () => translateRaw('TOAST_MESSAGE_ADDRESS_HAS_BEEN_ADDED'),
    type: ToastType.SUCCESS,
    position: 'top-left'
  },
  [ToastTemplates.failedTransaction]: {
    header: translateRaw('TOAST_ERROR'),
    message: () => translateRaw('TOAST_MESSAGE_TRANSACTION_DIDNT_GO_THROUGH'),
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.pleaseReload]: {
    header: translateRaw('TOAST_ERROR'),
    message: () => translateRaw('TOAST_MESSAGE_PLEASE_RELOAD_THE_APP'),
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.offline]: {
    header: translateRaw('TOAST_OFFLINE'),
    message: () => translateRaw('TOAST_MESSAGE_CHECK_INTERNET_CONNECTION'),
    type: ToastType.INFO,
    position: 'top-left'
  },
  [ToastTemplates.somethingWentWrong]: {
    header: translateRaw('TOAST_WE_ARE_SORRY'),
    message: () => translateRaw('TOAST_MESSAGE_SOMETHING_WENT_WRONG'),
    type: ToastType.ERROR,
    position: 'top-left'
  },
  [ToastTemplates.online]: {
    header: translateRaw('TOAST_ONLINE'),
    message: () => translateRaw('TOAST_MESSAGE_ALL_SYSTEMS_GOOD'),
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
