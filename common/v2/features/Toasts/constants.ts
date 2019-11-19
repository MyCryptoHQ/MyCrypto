import { ToastConfigsProps, ToastType } from './types';

export const ToastTemplates = {
  addedAddress: 'added-address'
};

export const toastConfigs: ToastConfigsProps = {
  [ToastTemplates.addedAddress]: {
    header: 'Success!',
    message: data => `${data ? data.label : 'Address'} has been added to your address book.`,
    type: ToastType.SUCCESS,
    position: 'top-left'
  }
};
