import { FunctionComponent } from 'react';

import {
  IStepComponentProps,
  ITxData,
  ITxFromAddress,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue,
  TStepAction
} from '@types';

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}

export interface IFullTxParam {
  invalid?: true;
  gasPrice: ITxGasPrice;
  gasLimit: ITxGasLimit;
  to: ITxToAddress;
  data: ITxData;
  nonce: ITxNonce;
  from: ITxFromAddress;
  value: ITxValue;
  chainId: string;
}
