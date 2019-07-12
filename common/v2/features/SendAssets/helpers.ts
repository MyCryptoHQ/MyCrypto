import { utils } from 'ethers';

import { getNetworkByChainId } from 'v2/libs';
import { ITxObject, ITxConfig, IFormikFields } from './types';

export function fromStateToTxObject(state: ITxConfig): ITxObject {
  return {
    to: state.recipientAddress, // @TODO or token address
    from: state.senderAccount.address,
    value: state.amount,
    data: state.data, // @TODO or generate contract call
    gasLimit: state.gasLimit,
    gasPrice: state.gasPrice,
    nonce: state.nonce,
    chainId: state.network!.chainId
  };
}

export function fromFormikStateToTxObject(formikState: IFormikFields): ITxObject {
  return {
    to: formikState.recipientAddress, // @TODO compose data according to asset type
    from: formikState.account.address,
    value: formikState.amount, // @TODO value depends on asset type
    data: formikState.txDataField, // @TODO compose data according to asset type
    gasLimit: formikState.gasLimitField, // @TODO update with correct value.
    gasPrice: formikState.gasPriceField, // @TODO update with correct value.
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
