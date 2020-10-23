import React, { useContext } from 'react';

import { Text } from '@components/NewTypography';
import { getAccountsByAsset, StoreContext, useAssets } from '@services';
import { translateRaw } from '@translations';
import { Asset, TUuid } from '@types';

interface MigrationSubHeadProps {
  assetUuid: TUuid;
}

export const MigrationSubHead = ({ assetUuid }: MigrationSubHeadProps) => {
  const { accounts } = useContext(StoreContext);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) || {}) as Asset;
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
