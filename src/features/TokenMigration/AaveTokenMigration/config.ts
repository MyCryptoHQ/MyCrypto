import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { DEFAULT_NETWORK_CHAINID } from '@config';
import { translateRaw } from '@translations';
import { ITokenMigrationConfig, ITxType, TAddress } from '@types';
import { generateAssetUUID } from '@utils';

import { createApproveTx, createMigrationTx } from './helpers';

export const AAVE_CONTRACT = '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' as TAddress;
export const LEND_CONTRACT = '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03' as TAddress;
export const MIGRATION_CONTRACT = '0x317625234562B1526Ea2FaC4030Ea499C5291de4' as TAddress;

export const migrationConfig: ITokenMigrationConfig = {
  title: translateRaw('AAVE Token Migration'),
  toContractAddress: AAVE_CONTRACT,
  fromContractAddress: LEND_CONTRACT,
  fromAssetUuid: generateAssetUUID(DEFAULT_NETWORK_CHAINID, LEND_CONTRACT),
  toAssetUuid: generateAssetUUID(DEFAULT_NETWORK_CHAINID, AAVE_CONTRACT),
  formActionBtn: translateRaw('AAVE_TOKEN_MIGRATION'),
  formAmountTooltip: translateRaw('AAVE_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP'),
  receiptTitle: translateRaw('AAVE_TOKEN_MIGRATION_RECEIPT'),
  txConstructionConfigs: [
    {
      txType: ITxType.APPROVAL,
      stepTitle: translateRaw('APPROVE_AAVE_TOKEN_MIGRATION'),
      stepContent: translateRaw('AAVE_TOKEN_MIGRATION_STEP1_TEXT'),
      actionBtnText: translateRaw('APPROVE_AAVE_TOKEN_MIGRATION'),
      stepSvg: step1SVG,
      constructTxFn: createApproveTx
    },
    {
      txType: ITxType.AAVE_TOKEN_MIGRATION,
      stepTitle: translateRaw('COMPLETE_AAVE_TOKEN_MIGRATION'),
      stepContent: translateRaw('AAVE_TOKEN_MIGRATION_STEP2_TEXT'),
      actionBtnText: translateRaw('CONFIRM_TRANSACTION'),
      stepSvg: step2SVG,
      constructTxFn: createMigrationTx
    }
  ]
};
