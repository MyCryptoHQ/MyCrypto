import React, { useContext } from 'react';

import { Text } from '@components/NewTypography';
import { getAccountsByAsset, StoreContext, useAssets } from '@services';
import { translateRaw } from '@translations';
import { Asset, TUuid } from '@types';

interface ActionSubHeadProps {
  assetUuid: TUuid;
}

export const ActionSubHead = ({ assetUuid }: ActionSubHeadProps) => {
  const { accounts } = useContext(StoreContext);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) || {}) as Asset;
  const relevantAccounts = getAccountsByAsset(accounts, asset);

  return (
    <Text mb={0} color="GREY">
      {translateRaw(relevantAccounts.length > 1 ? 'ACTION_SUBHEAD_PLURAL' : 'ACTION_SUBHEAD', {
        $total: relevantAccounts.length.toString()
      })}
    </Text>
  );
};
