import { bufferToHex } from 'ethereumjs-util';

import { SUPPORTED_TRANSACTION_QUERY_PARAMS } from '@config';
import { deriveTxRecipientsAndAmount, ERCType, guessERC20Type } from '@helpers';
import { encodeTransfer } from '@services/EthService';
import { translateRaw } from '@translations';
import {
  Asset,
  ExtendedAsset,
  IFormikFields,
  IQueryResults,
  ITxConfig,
  ITxData,
  ITxObject,
  ITxToAddress,
  ITxValue,
  Network,
  NetworkId,
  StoreAccount,
  TAddress,
  TTicker,
  TxQueryTypes
} from '@types';
import {
  Address,
  fromTokenBase,
  generateAssetUUID,
  handleValues,
  inputGasLimitToHex,
  inputGasPriceToHex,
  inputNonceToHex,
  inputValueToHex,
  isQueryValid,
  isSameAddress,
  TokenValue,
  toWei
} from '@utils';
import { isEmpty } from '@vendor';

import { TTxQueryParam, TxParam } from './preFillTx';
import { IFullTxParam } from './types';

const createBaseTxObject = (formData: IFormikFields): ITxObject => {
  const { network } = formData;
  const gas = network.supportsEIP1559
    ? {
        maxFeePerGas: inputGasPriceToHex(formData.maxFeePerGasField),
        maxPriorityFeePerGas: inputGasPriceToHex(formData.maxPriorityFeePerGasField),
        // @todo Perhaps needs to be settable by user?
        type: 2 as const
      }
    : {
        gasPrice: formData.advancedTransaction
          ? inputGasPriceToHex(formData.gasPriceField)
          : inputGasPriceToHex(formData.gasPriceSlider)
      };
  return {
    ...gas,
    to: formData.address.value as ITxToAddress,
    value: formData.amount ? inputValueToHex(formData.amount) : ('0x0' as ITxValue),
    data: formData.txDataField ? (formData.txDataField as ITxData) : ('0x0' as ITxData),
    gasLimit: inputGasLimitToHex(formData.gasLimitField),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

const createERC20TxObject = (formData: IFormikFields): ITxObject => {
  const baseTx = createBaseTxObject(formData);
  const { asset } = formData;
  return {
    ...baseTx,
    to: asset.contractAddress! as ITxToAddress,
    value: '0x0' as ITxValue,
    data: bufferToHex(
      encodeTransfer(
        Address(formData.address.value),
        formData.amount !== '' ? toWei(formData.amount, asset.decimal!) : TokenValue('0')
      )
    ) as ITxData
  };
};

export const isERC20Asset = (asset: Asset): boolean => {
  return !!(asset.type === 'erc20' && asset.contractAddress && asset.decimal);
};

export const processFormDataToTx = (formData: IFormikFields): ITxObject => {
  const transform = isERC20Asset(formData.asset) ? createERC20TxObject : createBaseTxObject;
  return transform(formData);
};

export const processFormForEstimateGas = (formData: IFormikFields): ITxObject => {
  const tx = processFormDataToTx(formData);
  return {
    ...tx,
    from: formData.account.address
  };
};

export const parseQueryParams = (queryParams: any) => (
  networks: Network[],
  assets: ExtendedAsset[],
  accounts: StoreAccount[]
) => {
  if (!queryParams || isEmpty(queryParams)) return;
  switch (queryParams.queryType) {
    case TxQueryTypes.SPEEDUP:
      return {
        queryType: TxQueryTypes.SPEEDUP,
        txConfig: parseTransactionQueryParams(queryParams)(networks, assets, accounts)
      };
    case TxQueryTypes.CANCEL:
      return {
        queryType: TxQueryTypes.CANCEL,
        txConfig: parseTransactionQueryParams(queryParams)(networks, assets, accounts)
      };
    default:
      return { queryType: TxQueryTypes.DEFAULT };
  }
};

export const parseTransactionQueryParams = (queryParams: any) => (
  networks: Network[],
  assets: ExtendedAsset[],
  accounts: StoreAccount[]
): ITxConfig | undefined => {
  // if speedup tx does not contain all the necessary parameters to construct a tx config return undefined
  const i = SUPPORTED_TRANSACTION_QUERY_PARAMS.reduce((acc, cv) => {
    if (queryParams[cv] === undefined) return acc;
    return { ...acc, [cv]: queryParams[cv] };
  }, {} as Record<TxParam, TTxQueryParam>) as IFullTxParam;

  const valid = isQueryValid((i as unknown) as IQueryResults);

  if (!valid) return;

  const network = networks.find((n) => n.chainId.toString() === i.chainId);
  if (!network) return;

  const senderAccount = accounts.find(({ address }) => isSameAddress(address, i.from));
  if (!senderAccount) return;

  const gas = i.gasPrice
    ? { gasPrice: i.gasPrice }
    : {
        maxFeePerGas: i.maxFeePerGas!,
        maxPriorityFeePerGas: i.maxPriorityFeePerGas!,
        type: (i.type ?? 2) as 2
      };

  const rawTransaction: ITxObject = {
    to: i.to,
    value: i.value,
    gasLimit: i.gasLimit,
    ...gas,
    nonce: i.nonce,
    data: i.data,
    chainId: parseInt(i.chainId, 16)
  };

  // This is labeled as "guess" because we can only identify simple erc20 transfers for now. If this is incorrect, It only affects displayed amounts - not the actual tx.
  const ercType = guessERC20Type(i.data);
  const isERC20 = ercType === ERCType.TRANSFER;

  const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
    ercType,
    i.data,
    i.to,
    i.value
  );
  const baseAsset = assets.find(({ uuid }) => uuid === network.baseAsset) as ExtendedAsset;
  const asset = isERC20
    ? assets.find(
        ({ contractAddress }) => contractAddress && isSameAddress(contractAddress as TAddress, to)
      ) || generateGenericErc20(to, i.chainId, network.id)
    : baseAsset;
  return {
    from: senderAccount.address,
    amount: fromTokenBase(handleValues(amount), asset.decimal),
    rawTransaction,
    networkId: network.id,
    senderAccount,
    baseAsset,
    asset,
    receiverAddress
  };
};

export const generateGenericErc20 = (
  contractAddress: TAddress,
  chainId: string,
  networkId: NetworkId
): ExtendedAsset => ({
  uuid: generateAssetUUID(chainId, contractAddress),
  name: translateRaw('GENERIC_ERC20_NAME'),
  ticker: 'Unknown ERC20' as TTicker,
  type: 'erc20',
  networkId
});
