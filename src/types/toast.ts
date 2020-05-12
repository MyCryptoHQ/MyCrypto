import { PositionsType } from 'toasted-notes/lib/Message';

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
  ONGOING = 'ONGOING',
  SWAP = 'SWAP'
}

export interface ToastConfig {
  type: ToastType;
  header: string;
  message(templateData?: any): string;
}

export interface ToastDisplayOptions extends ToastConfig {
  position: PositionsType;
  duration?: number | null;
}

export interface ToastConfigsProps {
  [key: string]: ToastDisplayOptions;
}
