import { BigNumber } from '@ethersproject/bignumber';

import { TOKEN_MIGRATIONS } from '@config';
import { translateRaw } from '@translations';
import {
  Asset,
  AssetBalanceObject,
  ExtendedContact,
  IAccount,
  ITxStatus,
  ITxType,
  Network,
  StoreAccount,
  StoreAsset,
  TUuid
} from '@types';

import { getLabelByAccount } from './Contact';
import { getNetworkById } from './Network';

const getAssetsByUuid = (accountAssets: AssetBalanceObject[], assets: Asset[]): StoreAsset[] =>
  accountAssets
    .map((asset) => {
      const refAsset = assets.find((a) => a.uuid === asset.uuid)!;
      return {
        ...refAsset,
        ...asset
      };
    })
    .map((asset) => ({ ...asset, balance: BigNumber.from(asset.balance), mtime: Date.now() }));

export const getStoreAccounts = (
  accounts: IAccount[],
  assets: Asset[],
  networks: Network[],
  contacts: ExtendedContact[]
): StoreAccount[] => {
  return accounts.map((a) => {
    const accountLabel = getLabelByAccount(a, contacts);
    return {
      ...a,
      assets: getAssetsByUuid(a.assets, assets),
      network: getNetworkById(a.networkId, networks),
      label: accountLabel ? accountLabel.label : translateRaw('NO_LABEL')
    };
  });
};

export const txIsPending = ({ status }: { status: ITxStatus }) => status === ITxStatus.PENDING;
export const txIsSuccessful = ({ status }: { status: ITxStatus }) => status === ITxStatus.SUCCESS;
export const txIsFailed = ({ status }: { status: ITxStatus }) => status === ITxStatus.FAILED;

export const isNotExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  !(excludedAssetUuids || []).includes(asset.uuid);

export const isExcludedAsset = (excludedAssetUuids: TUuid[]) => (asset: StoreAsset): boolean =>
  (excludedAssetUuids || []).includes(asset.uuid);

export const isTokenMigration = (type: ITxType) => TOKEN_MIGRATIONS.includes(type);
