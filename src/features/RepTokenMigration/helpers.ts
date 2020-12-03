import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { formatApproveTx } from '@helpers';
import { RepV2Token } from '@services/EthService';
import { ITokenMigrationFormFull, ITxData, ITxObject, ITxToAddress } from '@types';
import { inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { repTokenMigrationConfig } from './config';

export const createApproveTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.amount, DEFAULT_ASSET_DECIMAL),
    fromAddress: payload.account.address,
    spenderAddress: repTokenMigrationConfig.toContractAddress,
    chainId: DEFAULT_NETWORK_CHAINID,
    hexGasPrice: inputGasPriceToHex(payload.gasPrice)
  });

export const createRepMigrationTx = (
  payload: ITokenMigrationFormFull
): Omit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = RepV2Token.migrateFromLegacyReputationToken.encodeInput({});
  return {
    from: payload.account.address,
    to: repTokenMigrationConfig.toContractAddress,
    value: inputValueToHex('0'),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};
