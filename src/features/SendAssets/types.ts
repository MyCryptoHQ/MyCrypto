import { FunctionComponent } from 'react';
import { IStepComponentProps } from '@types';

export type TStepAction = (payload: any, after: () => void) => void;

export interface IPath {
  label: string;
  component: FunctionComponent<IStepComponentProps>;
  action: TStepAction;
}

export interface ReducerAction {
  type: ActionType;
  payload: any;
}

export enum ActionType {
  FORM_SUBMIT,
  SIGN,
  WEB3_SIGN,
  SEND,
  AFTER_SEND,
  RESUBMIT,
  RESET
}
