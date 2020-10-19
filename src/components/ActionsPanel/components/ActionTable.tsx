import React, { useContext } from 'react';

import styled from 'styled-components';

import { Amount, EthAddress } from '@components';
import { Text } from '@components/NewTypography';
import { getAccountBalance, getAccountsByAsset, StoreContext, useAssets } from '@services';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, TUuid } from '@types';
import { bigNumValueToViewableEther } from '@utils';

interface ActionTableProps {
  assetUuid: TUuid;
}

const STable = styled.table`
  & tbody tr th:first-child {
    padding-right: ${SPACING.BASE};
  }
`;

const AssetAmount = styled.div`
  display: flex;
  flex-direction: row;
`;

export const ActionTable = ({ assetUuid }: ActionTableProps) => {
  const { accounts } = useContext(StoreContext);
  const { getAssetByUUID } = useAssets();

  const asset = (getAssetByUUID(assetUuid) || {}) as Asset;
  const relevantAccounts = getAccountsByAsset(accounts, asset);

  return (
    <STable>
      <thead>
        <tr>
          <Text variant="tableHeading" as="th">
            {translateRaw('ADDRESS')}
          </Text>
          <Text variant="tableHeading" as="th">
            {translateRaw('BALANCE')}
          </Text>
        </tr>
      </thead>
      <tbody>
        {relevantAccounts.map((account, i) => {
          const balance = getAccountBalance(account, asset);
          return (
            <tr key={i}>
              <th>
                <EthAddress address={account.address} isCopyable={true} truncate={true} />
              </th>
              <th>
                <AssetAmount>
                  <Amount assetValue={bigNumValueToViewableEther(balance.toString())} />

                  <Text m={0} ml={SPACING.XS} fontWeight="normal">
                    {asset.ticker}
                  </Text>
                </AssetAmount>
              </th>
            </tr>
          );
        })}
      </tbody>
    </STable>
  );
};
