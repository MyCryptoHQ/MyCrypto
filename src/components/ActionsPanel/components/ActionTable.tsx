import React from 'react';

import styled from 'styled-components';

import { Amount, EthAddress } from '@components';
import { Text } from '@components/NewTypography';
import { SPACING } from '@theme';
import { translateRaw } from '@translations';
import { Asset, TAddress } from '@types';
import { bigNumValueToViewableEther } from '@utils';

export interface ActionTableProps {
  accounts: {
    address: TAddress;
    amount: string;
  }[];
  asset: Asset;
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

export const ActionTable = ({ accounts, asset }: ActionTableProps) => (
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
      {accounts.map((account, i) => {
        return (
          <tr key={i}>
            <th>
              <EthAddress address={account.address} isCopyable={true} truncate={true} />
            </th>
            <th>
              <AssetAmount>
                <Amount assetValue={bigNumValueToViewableEther(account.amount)} />

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
