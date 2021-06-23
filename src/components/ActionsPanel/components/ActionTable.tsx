import styled from 'styled-components';

import { Currency, EthAddress, Text } from '@components';
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
              <Currency amount={bigNumValueToViewableEther(account.amount)} ticker={asset.ticker} />
            </th>
          </tr>
        );
      })}
    </tbody>
  </STable>
);
