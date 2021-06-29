import { ILegacyTxObject, ITxObject, ITxType2Object } from '@types';

export const isTypedTx = (tx: ITxObject): tx is ITxType2Object => {
  return 'type' in tx;
};

export const isLegacyTx = (tx: ITxObject): tx is ILegacyTxObject => {
  return !isTypedTx(tx);
};
