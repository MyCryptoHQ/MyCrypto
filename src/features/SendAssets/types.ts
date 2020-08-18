import { FunctionComponent } from 'react';
import { IStepComponentProps, TStepAction } from '@types';

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}
