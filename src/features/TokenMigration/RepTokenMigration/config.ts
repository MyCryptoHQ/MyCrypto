import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { REPV1UUID, REPV2UUID } from '@config';
import { translateRaw } from '@translations';
import { ITokenMigrationConfig, ITxType, TAddress } from '@types';

import { createApproveTx, createRepMigrationTx } from './helpers';

export const repTokenMigrationConfig: ITokenMigrationConfig = {
  title: translateRaw('REP Token Migration'),
  toContractAddress: '0x221657776846890989a759BA2973e427DfF5C9bB' as TAddress,
  fromContractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' as TAddress,
  fromAssetUuid: REPV1UUID,
  toAssetUuid: REPV2UUID,
  formActionBtn: translateRaw('REP_TOKEN_MIGRATION'),
  formAmountTooltip: translateRaw('REP_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP'),
  receiptTitle: translateRaw('REP_TOKEN_MIGRATION_RECEIPT'),
  txConstructionConfigs: [
    {
      txType: ITxType.APPROVAL,
      stepTitle: translateRaw('APPROVE_REP_TOKEN_MIGRATION'),
      stepContent: translateRaw('REP_TOKEN_MIGRATION_STEP1_TEXT'),
      actionBtnText: translateRaw('APPROVE_REP_TOKEN_MIGRATION'),
      stepSvg: step1SVG,
      constructTxFn: createApproveTx
    },
    {
      txType: ITxType.REP_TOKEN_MIGRATION,
      stepTitle: translateRaw('COMPLETE_REP_TOKEN_MIGRATION'),
      stepContent: translateRaw('REP_TOKEN_MIGRATION_STEP2_TEXT'),
      actionBtnText: translateRaw('CONFIRM_TRANSACTION'),
      stepSvg: step2SVG,
      constructTxFn: createRepMigrationTx
    }
  ]
};

export const TOKEN_MIGRATION_GAS_LIMIT = 500000;
