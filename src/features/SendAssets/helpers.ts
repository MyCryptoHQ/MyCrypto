import BN from 'bn.js';
import { bufferToHex } from 'ethereumjs-util';
import isEmpty from 'ramda/src/isEmpty';

import {
  IFormikFields,
  ITxObject,
  IHexStrTransaction,
  Asset,
  IHexStrWeb3Transaction,
  ITxData,
  ITxGasLimit,
  ITxGasPrice,
  ITxNonce,
  ITxToAddress,
  ITxValue,
  ITxFromAddress,
  ITxConfig,
  Network,
  ExtendedAsset,
  TAddress,
  StoreAccount,
  NetworkId,
  TTicker
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
  decodeTransfer,
  fromTokenBase
} from '@services/EthService';
import { isTransactionDataEmpty, isSameAddress, generateAssetUUID } from '@utils';
import { handleValues } from '@services/EthService/utils/units';
import { CREATION_ADDRESS, MANDATORY_RESUBMIT_QUERY_PARAMS } from '@config';
import { hexNonceToViewable, hexToString } from '@services/EthService/utils/makeTransaction';
import { translateRaw } from '@translations';

const createBaseTxObject = (formData: IFormikFields): IHexStrTransaction | ITxObject => {
  const { network } = formData;
  return {
    to: formData.address.value as ITxToAddress,
    value: formData.amount ? inputValueToHex(formData.amount) : ('0x0' as ITxValue),
    data: formData.txDataField ? formData.txDataField : ('0x0' as ITxData),
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
    gasLimit: inputGasLimitToHex(formData.gasLimitField) as ITxGasLimit,
    gasPrice: formData.advancedTransaction
      ? (inputGasPriceToHex(formData.gasPriceField) as ITxGasPrice)
      : (inputGasPriceToHex(formData.gasPriceSlider) as ITxGasPrice),
    nonce: inputNonceToHex(formData.nonceField) as ITxNonce,
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
    case 'resubmit':
      return {
        type: 'resubmit',
        txConfig: parseResubmitParams(queryParams)(networks, assets, accounts)
      };
    default:
      return { type: 'default' };
  }
};

interface IMandatoryAcc {
  [key: string]: string;
}

interface IMandatoryItem {
  gasPrice: ITxGasPrice;
  gasLimit: ITxGasLimit;
  to: ITxToAddress;
  data: ITxData;
  nonce: ITxNonce;
  from: ITxFromAddress;
  value: ITxValue;
  chainId: string;
}

const parseResubmitParams = (queryParams: any) => (
  networks: Network[],
  assets: ExtendedAsset[],
  accounts: StoreAccount[]
): ITxConfig | undefined => {
  if (!MANDATORY_RESUBMIT_QUERY_PARAMS.every((mandatoryParam) => queryParams[mandatoryParam]))
    return;
  const i = (MANDATORY_RESUBMIT_QUERY_PARAMS.reduce((acc, cv) => {
    acc[cv] = queryParams[cv];
    return acc;
  }, {} as IMandatoryAcc) as unknown) as IMandatoryItem;

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
  // This is labeled as "guess" because we can only identify simple erc20 transfers for now. if this is incorrect, It'll only affect display values.
  const erc20tx = guessIfErc20Tx(i.data);

  const { to, amount, receiverAddress } = deriveTxRecipientsAndAmount(
    erc20tx,
    i.data,
    i.to,
    i.value
  );
  const defaultAsset = assets.find(({ uuid }) => uuid === network.baseAsset) as ExtendedAsset;
  const asset = erc20tx
    ? assets.find(
        ({ contractAddress }) => contractAddress && isSameAddress(contractAddress as TAddress, to)
      ) || generateGenericErc20(to, i.chainId, network.id)
    : defaultAsset;
  return {
    from: senderAccount.address,
    baseAsset: defaultAsset,
    gasPrice: hexToString(i.gasPrice),
    gasLimit: hexToString(i.gasLimit),
    nonce: hexNonceToViewable(i.nonce),
    data: i.data,
    amount: fromTokenBase(handleValues(amount), asset.decimal),
    value: i.value as ITxValue,
    rawTransaction,
    network,
    senderAccount,
    asset,
    receiverAddress
  };
};

const guessIfErc20Tx = (data: string): boolean => {
  if (isTransactionDataEmpty(data)) return false;
  const { _to, _value } = decodeTransfer(data);
  // if this isn't a valid transfer, _value will return 0 and _to will return the burn address '0x0000000000000000000000000000000000000000'
  if (!_to || !_value || _to === CREATION_ADDRESS) return false;
  return true;
};

const deriveTxRecipientsAndAmount = (
  isErc20: boolean,
  data: ITxData,
  toAddress: ITxToAddress,
  value: ITxValue
) => {
  if (isErc20) {
    const { _to, _value } = decodeTransfer(data);
    return { to: toAddress, amount: _value, receiverAddress: _to };
  }
  return { to: toAddress, amount: value, receiverAddress: toAddress };
};

const generateGenericErc20 = (
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
