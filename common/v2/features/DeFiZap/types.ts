import { FunctionComponent } from 'react';
import { ITxConfig, ITxReceipt } from 'v2/types';
import { IZapConfig } from './config';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IDeFiStepComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface IDeFiPath {
  label: string;
  component: FunctionComponent<any>;
  actions?: any;
  props?: any;
}

export interface ZapInteractionState {
  zapSelected: undefined | IZapConfig; // ToDo: Make enum
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
}
