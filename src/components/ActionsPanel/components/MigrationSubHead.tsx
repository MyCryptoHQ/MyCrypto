import { Text } from '@components/NewTypography';
import { getAccountsByAsset, useAssets } from '@services';
import { getStoreAccounts, useSelector } from '@store';
import { translateRaw } from '@translations';
import { Asset, TUuid } from '@types';

interface MigrationSubHeadProps {
  assetUuid: TUuid;
}

export const MigrationSubHead = ({ assetUuid }: MigrationSubHeadProps) => {
  const accounts = useSelector(getStoreAccounts);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) ?? {}) as Asset;
  const relevantAccounts = getAccountsByAsset(accounts, asset);

  return (
    <Text mb={0} color="GREY">
      {translateRaw(
        relevantAccounts.length > 1 ? 'MIGRATION_SUBHEAD_PLURAL' : 'MIGRATION_SUBHEAD',
        {
          $total: relevantAccounts.length.toString()
        }
      )}
    </Text>
  );
};
