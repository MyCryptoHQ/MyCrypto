import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';

import {
  IFormikFields,
  ITxObject,
  IHexStrTransaction,
  Asset,
  IHexStrWeb3Transaction,
  ITxData,
  ITxToAddress,
  ITxValue,
  ITxConfig,
  Network,
  ExtendedAsset,
  TAddress,
  StoreAccount,
  NetworkId,
  TTicker,
  TxQueryTypes
} from '@types';
import {
  Address,
  toWei,
  TokenValue,
  inputGasPriceToHex,
  inputValueToHex,
  inputNonceToHex,
  inputGasLimitToHex,
  encodeTransfer,
  fromTokenBase
} from '@services/EthService';
import {
  isSameAddress,
  generateAssetUUID,
  guessIfErc20Tx,
  deriveTxRecipientsAndAmount
} from '@utils';
import { handleValues } from '@services/EthService/utils/units';
import { MANDATORY_TRANSACTION_QUERY_PARAMS } from '@config';
import { hexNonceToViewable, hexToString } from '@services/EthService/utils/makeTransaction';
import { translateRaw } from '@translations';
import { isEmpty } from '@vendor';

import { IFullTxParam } from './types';
import { TxParam, TTxQueryParam } from './preFillTx';

const createBaseTxObject = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const { network } = formData;
  return {
    to: formData.address.value as ITxToAddress,
    value: formData.amount ? inputValueToHex(formData.amount) : ('0x0' as ITxValue),
    data: formData.txDataField ? (formData.txDataField as ITxData) : ('0x0' as ITxData),
    gasLimit: inputGasLimitToHex(formData.gasLimitField),
    gasPrice: formData.advancedTransaction
      ? inputGasPriceToHex(formData.gasPriceField)
      : inputGasPriceToHex(formData.gasPriceSlider),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

const createERC20TxObject = (formData: IFormikFields): IHexStrTransaction => {
  const { asset, network } = formData;
  return {
    to: asset.contractAddress! as ITxToAddress,
    value: '0x0' as ITxValue,
    data: bufferToHex(
      encodeTransfer(
        Address(formData.address.value),
        formData.amount !== '' ? toWei(formData.amount, asset.decimal!) : TokenValue(new BN(0))
      )
    ) as ITxData,
    gasLimit: inputGasLimitToHex(formData.gasLimitField),
    gasPrice: formData.advancedTransaction
      ? inputGasPriceToHex(formData.gasPriceField)
      : inputGasPriceToHex(formData.gasPriceSlider),
    nonce: inputNonceToHex(formData.nonceField),
    chainId: network.chainId ? network.chainId : 1
  };
};

export const isERC20Tx = (asset: Asset): boolean => {
  return !!(asset.type === 'erc20' && asset.contractAddress && asset.decimal);
};

export const processFormDataToTx = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  return transform(formData);
};

export const processFormForEstimateGas = (formData: IFormikFields): IHexStrWeb3Transaction => {
  const transform = isERC20Tx(formData.asset) ? createERC20TxObject : createBaseTxObject;
  // First we use destructuring to remove the `gasLimit` field from the object that is not used by IHexStrWeb3Transaction
  // then we add the extra properties required.
  const { gasLimit, ...tx } = transform(formData);
  return {
    ...tx,
    from: formData.account.address,
    gas: inputGasLimitToHex(formData.gasLimitField)
  };
};

export const parseQueryParams = (queryParams: any) => (
  networks: Network[],
  assets: ExtendedAsset[],
  accounts: StoreAccount[]
) => {
  if (!queryParams || isEmpty(queryParams)) return;
  switch (queryParams.type) {
    case TxQueryTypes.SPEEDUP:
      return {
        type: TxQueryTypes.SPEEDUP,
        txConfig: parseTransactionQueryParams(queryParams)(networks, assets, accounts)
      };
    case TxQueryTypes.CANCEL:
      return {
        type: TxQueryTypes.CANCEL,
        txConfig: parseTransactionQueryParams(queryParams)(networks, assets, accounts)
      };
    default:
      return { type: TxQueryTypes.DEFAULT };
  }
};

export const parseTransactionQueryParams = (queryParams: any) => (
  networks: Network[],
  assets: ExtendedAsset[],
  accounts: StoreAccount[]
): ITxConfig | undefined => {
  // if speedup tx does not contain all the necessary parameters to construct a tx config return undefined
  const i = MANDATORY_TRANSACTION_QUERY_PARAMS.reduce((acc, cv) => {
    if (queryParams[cv] === undefined) return { ...acc, invalid: true };
    acc[cv] = queryParams[cv];
    return acc;
  }, {} as Record<TxParam, TTxQueryParam>) as IFullTxParam;
  if (i.invalid) return;

  const network = networks.find((n) => n.chainId.toString() === i.chainId);
  if (!network) return;

  const senderAccount = accounts.find(({ address }) => isSameAddress(address, i.from));
  if (!senderAccount) return;

  const rawTransaction: ITxObject = {
    to: i.to,
    value: i.value,
    gasLimit: i.gasLimit,
    gasPrice: i.gasPrice,
    nonce: i.nonce,
    data: i.data,
    chainId: parseInt(i.chainId, 16)
  };

  // This is labeled as "guess" because we can only identify simple erc20 transfers for now. If this is incorrect, It only affects displayed amounts - not the actual tx.
  const erc20tx = guessIfErc20Tx(i.data);

  const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
    erc20tx,
    i.data,
    i.to,
    i.value
  );
  const baseAsset = assets.find(({ uuid }) => uuid === network.baseAsset) as ExtendedAsset;
  const asset = erc20tx
    ? assets.find(
        ({ contractAddress }) => contractAddress && isSameAddress(contractAddress as TAddress, to)
      ) || generateGenericErc20(to, i.chainId, network.id)
    : baseAsset;
  return {
    from: senderAccount.address,
    gasPrice: hexToString(i.gasPrice),
    gasLimit: hexToString(i.gasLimit),
    nonce: hexNonceToViewable(i.nonce),
    data: i.data,
    amount: fromTokenBase(handleValues(amount), asset.decimal),
    value: hexToString(i.value),
    rawTransaction,
    network,
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
