import { getAssetByUUID } from '@services';
import { ITxConfig, ITxObject, StoreAccount } from '@types';
import { hexToString, hexWeiToString } from '@utils';

export const makeDeployContractTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  amount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, to, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;

  const txConfig: ITxConfig = {
    from: address,
    amount,
    receiverAddress: to,
    senderAccount: account,
    network,
    asset: baseAsset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit,
    value: hexWeiToString(value),
    nonce,
    data,
    rawTransaction
  };

  return txConfig;
};

export const constructGasCallProps = (data: string, account: StoreAccount) => ({
  from: account.address,
  value: '0x0',
  data
});
