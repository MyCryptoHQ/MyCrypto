import { ILegacyTxObject, ITxObject, ITxType2Object } from '@types';

export const isTypedTx = (tx: ITxObject): tx is ITxType2Object => {
  return 'type' in tx;
};

export const isType2Tx = (tx: ITxObject): tx is ITxType2Object => {
  return isTypedTx(tx) && tx.type === 2;
};

export const isLegacyTx = (tx: ITxObject): tx is ILegacyTxObject => {
  return !isTypedTx(tx);
};
