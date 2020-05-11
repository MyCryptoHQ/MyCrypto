import { FunctionComponent } from 'react';
import { IStepComponentProps } from '@types';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}
