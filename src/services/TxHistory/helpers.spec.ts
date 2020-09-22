import { ITxHistoryType } from '@features/Dashboard/types';
import { fAccounts, fTxReceipt } from '@fixtures';

import { deriveTxType } from './helpers';

describe('deriveTxType', () => {
  it('derives OUTBOUND tx correctly', () => {
    const result = deriveTxType(fAccounts, fTxReceipt);
    expect(result).toBe(ITxHistoryType.OUTBOUND);
  });
  it('derives TRANSFER tx correctly', () => {
    const result = deriveTxType(fAccounts, {
      ...fTxReceipt,
      receiverAddress: fTxReceipt.from,
      from: fTxReceipt.from,
      to: fTxReceipt.from
    });
    expect(result).toBe(ITxHistoryType.TRANSFER);
  });
  it('derives INBOUND tx correctly', () => {
    const result = deriveTxType(fAccounts, {
      ...fTxReceipt,
      receiverAddress: fTxReceipt.from,
      from: fTxReceipt.to,
      to: fTxReceipt.from
    });
    expect(result).toBe(ITxHistoryType.INBOUND);
  });
  it('default to passed txType', () => {
    const result = deriveTxType(fAccounts, {
      ...fTxReceipt,
      from: fTxReceipt.to
    });
    expect(result).toBe(ITxHistoryType.STANDARD);
  });
});
