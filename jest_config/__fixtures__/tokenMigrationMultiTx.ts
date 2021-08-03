import { REPV1UUID } from '@config';
import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { createApproveTx, createRepMigrationTx } from '@features/RepTokenMigration/helpers';
import { fApproveERC20TxResponse, fREPTokenMigrationTxResponse } from '@fixtures';
import { ITokenMigrationFormFull, ITxStatus, ITxType, TxParcel } from '@types';
import { generateUUID, inputGasLimitToHex, inputNonceToHex } from '@utils';

import { fAccount } from './account';
import { fAssets } from './assets';
import { fNetwork } from './network';

export const fTokenMigrationTxs = (): TxParcel[] => {
  const tokenMigrationPayload: ITokenMigrationFormFull = {
    tokenConfig: repTokenMigrationConfig,
    asset: fAssets.find(({ uuid }) => uuid === REPV1UUID)!,
    network: fNetwork,
    address: fAccount.address,
    amount: '4',
    gasLimit: 500000,
    gasPrice: '20',
    nonce: '1',
    account: fAccount,
    maxFeePerGas: '20',
    maxPriorityFeePerGas: '1'
  };
  const approveTx = createApproveTx(tokenMigrationPayload);
  const approveTxParcel: TxParcel = {
    _uuid: generateUUID(),
    txRaw: {
      ...approveTx,
      gasLimit: inputGasLimitToHex('150000'),
      nonce: inputNonceToHex(tokenMigrationPayload.nonce)
    },
    txType: ITxType.APPROVAL,
    txResponse: fApproveERC20TxResponse,
    status: ITxStatus.CONFIRMING
  };
  const migrationTx = createRepMigrationTx(tokenMigrationPayload);
  const migrationTxParcel: TxParcel = {
    _uuid: generateUUID(),
    txRaw: {
      ...migrationTx,
      gasLimit: inputGasLimitToHex(tokenMigrationPayload.gasLimit.toString()),
      nonce: inputNonceToHex((parseInt(tokenMigrationPayload.nonce) + 1).toString())
    },
    txType: ITxType.REP_TOKEN_MIGRATION,
    txResponse: fREPTokenMigrationTxResponse,
    status: ITxStatus.CONFIRMING
  };
  return [approveTxParcel, migrationTxParcel];
};
