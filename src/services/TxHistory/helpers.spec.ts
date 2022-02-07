import { ITxHistoryType } from '@features/Dashboard/types';
import { fAccounts, fAssets, fNetwork, fRopDAI, fTxReceipt, fTxTypeMetas } from '@fixtures';
import { TAddress } from '@types';
import { generateGenericERC20, generateGenericERC721 } from '@utils';

import { buildTxValueTransfers, deriveTxType } from './helpers';

describe('deriveTxType', () => {
  it('derives OUTBOUND tx correctly', () => {
    const result = deriveTxType(fTxTypeMetas, fAccounts, fTxReceipt);
    expect(result).toBe(ITxHistoryType.OUTBOUND);
  });
  it('derives TRANSFER tx correctly', () => {
    const result = deriveTxType(fTxTypeMetas, fAccounts, {
      ...fTxReceipt,
      receiverAddress: fTxReceipt.from,
      from: fTxReceipt.from,
      to: fTxReceipt.from
    });
    expect(result).toBe(ITxHistoryType.TRANSFER);
  });
  it('derives INBOUND tx correctly', () => {
    const result = deriveTxType(fTxTypeMetas, fAccounts, {
      ...fTxReceipt,
      receiverAddress: fTxReceipt.from,
      from: fTxReceipt.to,
      to: fTxReceipt.from
    });
    expect(result).toBe(ITxHistoryType.INBOUND);
  });
  it('default to passed txType', () => {
    const result = deriveTxType(fTxTypeMetas, fAccounts, {
      fTxTypeMetas,
      ...fTxReceipt,
      from: fTxReceipt.to
    });
    expect(result).toBe(ITxHistoryType.STANDARD);
  });
});

describe('buildTxValueTransfers', () => {
  const toAddr = '0x0000000000000000000000000000000000000001' as TAddress;
  const fromAddr = '0x0000000000000000000000000000000000000002' as TAddress;
  const contractAddr = '0x0000000000000000000000000000000000000003' as TAddress
  
  it('correctly builds txValueTransfers for an unknown token transfer', () => {
    const result = buildTxValueTransfers(fNetwork, fAssets)({
      from: fromAddr,
      to: toAddr,
      contractAddress: contractAddr,
      amount: '10000000000'
    });
    expect(result).toStrictEqual({
      amount: undefined,
      asset: generateGenericERC20(contractAddr, fNetwork.chainId.toString(), fNetwork.id),
      from: "0x0000000000000000000000000000000000000002",
      to: "0x0000000000000000000000000000000000000001",
    });
  });

  it('correctly builds txValueTransfers for a generic nft transfer', () => {
    const result = buildTxValueTransfers(fNetwork, fAssets)({
      from: fromAddr,
      to: toAddr,
      contractAddress: contractAddr,
      amount: '0x'
    });
    expect(result).toStrictEqual({
      amount: undefined,
      asset: generateGenericERC721(contractAddr, fNetwork.chainId.toString(), fNetwork.id),
      from: "0x0000000000000000000000000000000000000002",
      to: "0x0000000000000000000000000000000000000001",
    });
  });

  it('correctly builds txValueTransfers for a known erc20 token', () => {
    const result = buildTxValueTransfers(fNetwork, fAssets)({
      from: fromAddr,
      to: toAddr,
      contractAddress: fRopDAI.contractAddress as TAddress,
      amount: '0xde0b6b3a7640000'
    });
    expect(result).toStrictEqual({
      amount: '1',
      asset: fRopDAI,
      from: "0x0000000000000000000000000000000000000002",
      to: "0x0000000000000000000000000000000000000001",
    });
  });

  it('correctly builds txValueTransfers for a known erc20 token with 0 amount', () => {
    const result = buildTxValueTransfers(fNetwork, fAssets)({
      from: fromAddr,
      to: toAddr,
      contractAddress: fRopDAI.contractAddress as TAddress,
      amount: '0x'
    });
    expect(result).toStrictEqual({
      amount: '0',
      asset: fRopDAI,
      from: "0x0000000000000000000000000000000000000002",
      to: "0x0000000000000000000000000000000000000001",
    });
  });
})
