import { Property } from 'csstype';

import { TIcon } from '@components';
import { ITxType, TURL } from '@types';

export interface Action {
  icon?: TIcon;
  faded?: boolean;
  title: string;
  description: string;
  link: string | TURL;
  justifyContent?: Property.JustifyContent;
  filter?(isMobile: boolean): boolean;
}

enum IStandardTxType {
  TRANSFER = 'TRANSFER',
  OUTBOUND = 'OUTBOUND',
  INBOUND = 'INBOUND'
}

export const ITxHistoryType = { ...ITxType, ...IStandardTxType };

export type ITxHistoryType = Exclude<
  Exclude<ITxType | IStandardTxType, ITxType.STANDARD>,
  ITxType.UNKNOWN
>;
