import { FunctionComponent } from 'react';
import {
  IStepComponentProps,
  TStepAction,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue,
  ITxFromAddress
} from '@types';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}

export interface IMandatoryAcc {
  [key: string]: string;
}

export interface IMandatoryItem {
  gasPrice: ITxGasPrice;
  gasLimit: ITxGasLimit;
  to: ITxToAddress;
  data: ITxData;
  nonce: ITxNonce;
  from: ITxFromAddress;
  value: ITxValue;
  chainId: string;
}
