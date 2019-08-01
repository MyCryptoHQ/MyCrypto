import { utils } from 'ethers';

import { getNetworkByChainId } from 'v2/services/Store';
import { ITxObject, ITxConfig, IFormikFields } from './types';
import { gasPriceToBase, fromWei } from 'v2/services/EthService/utils/units';

export function fromStateToTxObject(state: ITxConfig): ITxObject {
  return {
    to: state.to, // @TODO or token address
    value: state.value,
    data: state.data, // @TODO or generate contract call
    gasLimit: state.gasLimit,
    gasPrice: state.gasPrice,
    nonce: state.nonce,
    chainId: state.network!.chainId
  };
}

export function fromFormikStateToTxObject(formikState: IFormikFields): ITxObject {
  return {
    to: formikState.receiverAddress, // @TODO compose data according to asset type
    value: formikState.amount, // @TODO value depends on asset type
    data: formikState.txDataField, // @TODO compose data according to asset type
    gasLimit: formikState.gasLimitField, // @TODO update with correct value.
    gasPrice: fromWei(gasPriceToBase(parseFloat(formikState.gasPriceField)), 'ether'), // @TODO update with correct value.
    nonce: formikState.nonceField, // @TODO update with correct value.
    chainId: formikState.network.chainId
  };
}

export function decodeTransaction(signedTx: string) {
  const decodedTranasction = utils.parseTransaction(signedTx);

  if (!decodedTranasction) {
    return;
  }

  const toAddress = decodedTranasction.to;
  const fromAddress = decodedTranasction.from;
  const gasLimitWei = utils.bigNumberify(decodedTranasction.gasLimit);
  const gasPriceWei = utils.bigNumberify(decodedTranasction.gasPrice);
  const nonce = decodedTranasction.nonce;
  const data = decodedTranasction.data;

  const amountToSendWei = utils.bigNumberify(decodedTranasction.value);
  const amountToSendEther = utils.formatEther(amountToSendWei);

  const maxCostWei = gasPriceWei.mul(gasLimitWei);
  const maxCostFeeEther = utils.formatEther(maxCostWei);

  const totalAmountWei = amountToSendWei.add(maxCostWei);
  const totalAmountEther = utils.formatEther(totalAmountWei);

  return {
    to: toAddress,
    from: fromAddress,
    value: amountToSendEther.toString(),
    gasLimit: gasLimitWei.toString(),
    gasPrice: gasPriceWei.toString(),
    nonce,
    data,
    maxCostFeeEther: maxCostFeeEther.toString(),
    totalAmountEther
  };
}

export async function getNetworkNameFromSignedTx(signedTx: string) {
  const decodedTranasction = utils.parseTransaction(signedTx);
  const chainId = decodedTranasction.chainId.toString();
  const network = await getNetworkByChainId(chainId);

  return network ? network.name : undefined;
}
