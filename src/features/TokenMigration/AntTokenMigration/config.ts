import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { translateRaw } from '@translations';
import { ITokenMigrationConfig, ITxType, TAddress } from '@types';
import { generateAssetUUID } from '@utils';

import { createApproveTx, createMigrationTx } from './helpers';

export const ANTv1_CONTRACT = '0x960b236A07cf122663c4303350609A66A7B288C0' as TAddress;
export const ANTv2_CONTRACT = '0xa117000000f279D81A1D3cc75430fAA017FA5A2e' as TAddress;
export const MIGRATION_CONTRACT = '0x078BEbC744B819657e1927bF41aB8C74cBBF912D' as TAddress;

export const tokenMigrationConfig: ITokenMigrationConfig = {
  title: translateRaw('ANT Token Migration'),
  toContractAddress: ANTv2_CONTRACT,
  fromContractAddress: ANTv1_CONTRACT,
  fromAssetUuid: generateAssetUUID(1, ANTv1_CONTRACT),
  toAssetUuid: generateAssetUUID(1, ANTv2_CONTRACT),
  formActionBtn: translateRaw('ANT_TOKEN_MIGRATION'),
  formAmountTooltip: translateRaw('ANT_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP'),
  receiptTitle: translateRaw('ANT_TOKEN_MIGRATION_RECEIPT'),
  txConstructionConfigs: [
    {
      txType: ITxType.APPROVAL,
      stepTitle: translateRaw('APPROVE_ANT_TOKEN_MIGRATION'),
      stepContent: translateRaw('ANT_TOKEN_MIGRATION_STEP1_TEXT'),
      actionBtnText: translateRaw('APPROVE_ANT_TOKEN_MIGRATION'),
      stepSvg: step1SVG,
      constructTxFn: createApproveTx
    },
    {
      txType: ITxType.ANT_TOKEN_MIGRATION,
      stepTitle: translateRaw('COMPLETE_ANT_TOKEN_MIGRATION'),
      stepContent: translateRaw('ANT_TOKEN_MIGRATION_STEP2_TEXT'),
      actionBtnText: translateRaw('CONFIRM_TRANSACTION'),
      stepSvg: step2SVG,
      constructTxFn: createMigrationTx
    }
  ]
};
