import { TIcon } from '@components';
import { ITxType, TURL } from '@types';

export interface Action {
  icon: TIcon;
  faded?: boolean;
  title: string;
  description: string;
  link: string | TURL;
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
