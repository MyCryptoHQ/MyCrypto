import step1SVG from '@assets/images/icn-receive.svg';
import { GOLEMV1UUID, GOLEMV2UUID } from '@config';
import { translateRaw } from '@translations';
import { ITokenMigrationConfig, ITxType, TAddress } from '@types';

import { createGolemMigrationTx } from './helpers';

export const golemTokenMigrationConfig: ITokenMigrationConfig = {
  title: translateRaw('GOLEM Token Migration'),
  toContractAddress: '0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429' as TAddress,
  fromContractAddress: '0xa74476443119A942dE498590Fe1f2454d7D4aC0d' as TAddress,
  fromAssetUuid: GOLEMV1UUID,
  toAssetUuid: GOLEMV2UUID,
  formActionBtn: translateRaw('GOLEM_TOKEN_MIGRATION'),
  formAmountTooltip: translateRaw('GOLEM_TOKEN_MIGRATION_AMOUNT_DISABLED_TOOLTIP'),
  receiptTitle: translateRaw('GOLEM_TOKEN_MIGRATION_RECEIPT'),
  txConstructionConfigs: [
    {
      txType: ITxType.GOLEM_TOKEN_MIGRATION,
      stepTitle: translateRaw('COMPLETE_GOLEM_TOKEN_MIGRATION'),
      stepContent: translateRaw('GOLEM_TOKEN_MIGRATION_STEP1_TEXT'),
      actionBtnText: translateRaw('CONFIRM_TRANSACTION'),
      stepSvg: step1SVG,
      constructTxFn: createGolemMigrationTx
    }
  ]
};

export const TOKEN_MIGRATION_GAS_LIMIT = 500000;
