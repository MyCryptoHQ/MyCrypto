import { ITxConfig, ITxReceipt } from '@types';

import { IZapConfig } from './config';

export interface ZapInteractionState {
  zapSelected: undefined | IZapConfig; // @todo: Make enum
  txConfig: ITxConfig;
  txReceipt: ITxReceipt | undefined;
}
