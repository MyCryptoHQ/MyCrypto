import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { formatApproveTx, makeTxFromForm } from '@helpers';
import { RepV2Token } from '@services/EthService';
import {
  DistributiveOmit,
  ITokenMigrationFormFull,
  ITxData,
  ITxObject,
  ITxToAddress
} from '@types';
import { inputGasPriceToHex, toWei } from '@utils';

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
): DistributiveOmit<ITxObject, 'nonce' | 'gasLimit'> => {
  const data = RepV2Token.migrateFromLegacyReputationToken.encodeInput({}) as ITxData;
  return makeTxFromForm(
    { ...payload, address: repTokenMigrationConfig.toContractAddress },
    '0',
    data
  );
};
