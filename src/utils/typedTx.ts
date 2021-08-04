import {
  ILegacyTxObject,
  ILegacyTxReceipt,
  ITxObject,
  ITxReceipt,
  ITxType2Object,
  ITxType2Receipt
} from '@types';

export const isTypedTx = (tx: Partial<ITxObject>): tx is Partial<ITxType2Object> => {
  return 'type' in tx && tx.type !== null && tx.type !== undefined && tx.type !== 0;
};

export const isType2Tx = (tx: Partial<ITxObject>): tx is Partial<ITxType2Object> => {
  return isTypedTx(tx) && tx.type === 2;
};

export const isLegacyTx = (tx: ITxObject): tx is ILegacyTxObject => {
  return !isTypedTx(tx);
};

export const isTypedReceipt = (tx: ITxReceipt): tx is ITxType2Receipt => {
  return 'type' in tx && tx.type !== null && tx.type !== undefined && tx.type !== 0;
};

export const isType2Receipt = (tx: ITxReceipt): tx is ITxType2Receipt => {
  return isTypedReceipt(tx) && tx.type === 2;
};

export const isLegacyReceipt = (tx: ITxReceipt): tx is ILegacyTxReceipt => {
  return !isTypedReceipt(tx);
};
