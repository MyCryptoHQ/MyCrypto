export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
  ONGOING = 'ONGOING',
  COMPLETE = 'COMPLETE'
}

export interface IToast {
  type: ToastType;
  header: string;
  message: string;
}
