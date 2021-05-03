import { BigNumber } from '@ethersproject/bignumber';
import { parseEther } from '@ethersproject/units';

import { ITxHistoryType } from '@features/Dashboard/types';
import { deriveTxFields, guessERC20Type } from '@helpers';
import { ITxHistoryApiResponse } from '@services/ApiService/History';
import { getAssetByContractAndNetwork, getBaseAssetByNetwork } from '@services/Store';
import { Asset, IAccount, ITxReceipt, ITxType, Network } from '@types';
import { fromWei, isSameAddress, isVoid, Wei } from '@utils';

export const makeTxReceipt = (
  tx: ITxHistoryApiResponse,
  network: Network,
  assets: Asset[]
): ITxReceipt => {
  const contractAsset = getAssetByContractAndNetwork(tx.to, network)(assets);
  const baseAsset = getBaseAssetByNetwork({
    network,
    assets
  })!;

  const value = fromWei(Wei(BigNumber.from(tx.value).toString()), 'ether');

  // Use this for now to improve quality of receipts
  // @todo: Use erc20 transfer array
  const ercType = guessERC20Type(tx.data);
  const { amount, asset } = deriveTxFields(
    ercType,
    tx.data,
    tx.to,
    tx.value,
    baseAsset,
    contractAsset
  );

  return {
    ...tx,
    asset,
    baseAsset: baseAsset!,
    receiverAddress: tx.recipientAddress,
    amount,
    data: tx.data,
    gasPrice: BigNumber.from(tx.gasPrice),
    gasLimit: BigNumber.from(tx.gasLimit),
    gasUsed: !isVoid(tx.gasUsed) ? BigNumber.from(tx.gasUsed!) : undefined,
    value: parseEther(value),
    nonce: BigNumber.from(tx.nonce),
    blockNumber: !isVoid(tx.blockNumber) ? BigNumber.from(tx.blockNumber!).toNumber() : undefined
  };
};

export const merge = (apiTxs: ITxReceipt[], accountTxs: ITxReceipt[]): ITxReceipt[] => {
  // Prioritize Account TX - needs to be more advanced?
  const filteredApiTxs = apiTxs.filter((tx) => !accountTxs.find((a) => a.hash === tx.hash));
  return filteredApiTxs.concat(accountTxs);
};

// Mapping from TX API types to our current types
const TYPE_MAPPING = {
  ERC_20_APPROVE: ITxType.APPROVAL,
  '1INCH_EXCHANGE': ITxType.ONE_INCH_EXCHANGE,
  AAVE_BORROW: ITxType.AAVE_BORROW,
  AAVE_DEPOSIT: ITxType.AAVE_DEPOSIT,
  AAVE_REPAY: ITxType.AAVE_REPAY,
  AAVE_WITHDRAW: ITxType.AAVE_WITHDRAW,
  COMPOUND_V2_BORROW: ITxType.COMPOUND_V2_BORROW,
  COMPOUND_V2_DEPOSIT: ITxType.COMPOUND_V2_DEPOSIT,
  COMPOUND_V2_REPAY: ITxType.COMPOUND_V2_REPAY,
  COMPOUND_V2_WITHDRAW: ITxType.COMPOUND_V2_WITHDRAW,
  DEX_AG_EXCHANGE: ITxType.DEX_AG_EXCHANGE,
  ETHERMINE_MINING_PAYOUT: ITxType.ETHERMINE_MINING_PAYOUT,
  GNOSIS_SAFE_APPROVE_TX: ITxType.GNOSIS_SAFE_APPROVE_TX,
  GNOSIS_SAFE_WITHDRAW: ITxType.GNOSIS_SAFE_WITHDRAW,
  IDEX_DEPOSIT_ETH: ITxType.IDEX_DEPOSIT_ETH,
  IDEX_DEPOSIT_TOKEN: ITxType.IDEX_DEPOSIT_TOKEN,
  IDEX_WITHDRAW: ITxType.IDEX_WITHDRAW,
  KYBER_EXCHANGE: ITxType.KYBER_EXCHANGE,
  MININGPOOLHUB_MINING_PAYOUT: ITxType.MININGPOOLHUB_MINING_PAYOUT,
  PARASWAP_EXCHANGE: ITxType.PARASWAP_EXCHANGE,
  SPARKPOOL_MINING_PAYOUT: ITxType.SPARKPOOL_MINING_PAYOUT,
  UNISWAP_V1_DEPOSIT: ITxType.UNISWAP_V1_DEPOSIT,
  UNISWAP_V1_EXCHANGE: ITxType.UNISWAP_V1_EXCHANGE,
  UNISWAP_V1_WITHDRAW: ITxType.UNISWAP_V1_WITHDRAW,
  UNISWAP_V2_DEPOSIT: ITxType.UNISWAP_V2_DEPOSIT,
  UNISWAP_V2_EXCHANGE: ITxType.UNISWAP_V2_EXCHANGE,
  UNISWAP_V2_ROUTER_TO: ITxType.UNISWAP_V2_ROUTER_TO,
  UNISWAP_V2_WITHDRAW: ITxType.UNISWAP_V2_WITHDRAW,
  WETH_UNWRAP: ITxType.WETH_UNWRAP,
  WETH_WRAP: ITxType.WETH_WRAP
} as { [key: string]: ITxHistoryType };

export const deriveTxType = (accountsList: IAccount[], tx: ITxReceipt): ITxHistoryType => {
  const fromAccount =
    tx.from && accountsList.find(({ address }) => isSameAddress(address, tx.from));
  const toAddress = tx.receiverAddress || tx.to;
  const toAccount =
    toAddress && accountsList.find(({ address }) => isSameAddress(address, toAddress));

  const isInvalidTxHistoryType =
    !('txType' in tx) ||
    tx.txType === ITxHistoryType.STANDARD ||
    tx.txType === ITxHistoryType.UNKNOWN ||
    !Object.values(ITxHistoryType).some((t) => t === tx.txType);

  const mapping = Object.keys(TYPE_MAPPING).find((t) => t === tx.txType);
  if (isInvalidTxHistoryType && mapping) {
    return TYPE_MAPPING[mapping];
  }

  if (isInvalidTxHistoryType && toAccount && fromAccount) {
    return ITxHistoryType.TRANSFER;
  } else if (isInvalidTxHistoryType && !toAccount && fromAccount) {
    return ITxHistoryType.OUTBOUND;
  } else if (isInvalidTxHistoryType && toAccount && !fromAccount) {
    return ITxHistoryType.INBOUND;
  }

  return tx.txType as ITxHistoryType;
};
