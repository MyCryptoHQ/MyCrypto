import { TAddress, TUuid } from '@types';
import { REPV1UUID, REPV2UUID } from '@utils';

export interface ITokenMigrationConfig {
  title: string;
  toContractAddress: TAddress;
  fromContractAddress: TAddress;
  fromAssetUuid: TUuid;
  toAssetUuid: TUuid;
}

export const tokenMigrationConfig: ITokenMigrationConfig = {
  title: 'REP Token Migration',
  toContractAddress: '0x221657776846890989a759BA2973e427DfF5C9bB' as TAddress,
  fromContractAddress: '0x1985365e9f78359a9B6AD760e32412f4a445E862' as TAddress,
  fromAssetUuid: REPV1UUID,
  toAssetUuid: REPV2UUID
};

export const TOKEN_MIGRATION_GAS_LIMIT = 500000;
