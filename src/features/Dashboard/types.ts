import { State as StoreContextState } from '@services/Store/StoreProvider';
import { ITxType, TURL } from '@types';

export interface Action {
  icon: string;
  faded?: boolean;
  title: string;
  description: string;
  link: string | TURL;
  filter?(state: StoreContextState): boolean;
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
