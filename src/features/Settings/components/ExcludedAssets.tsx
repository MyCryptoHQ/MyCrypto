import React, { useContext } from 'react';

import styled from 'styled-components';

import { AddIcon, BalanceDetailsTable, DashboardPanel, Tooltip } from '@components';
import { SettingsContext } from '@services/Store';
import { translateRaw } from '@translations';
import { Balance, Fiat, IAccount, TUuid } from '@types';

const SIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UnHideAssetButton = ({ uuid }: { uuid: TUuid }) => {
  const { removeAssetfromExclusionList } = useContext(SettingsContext);
  return (
    <SIconContainer onClick={() => removeAssetfromExclusionList(uuid)}>
      <Tooltip tooltip={translateRaw('UNHIDE_ASSET_TOOLTIP')}>
        <SIconContainer>
          <AddIcon size="xl" />
        </SIconContainer>
      </Tooltip>
    </SIconContainer>
  );
};

interface ExcludedAssetsProps {
  balances: Balance[];
  totalFiatValue: number;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
}

const ExcludedAssets = (props: ExcludedAssetsProps) => {
  return (
    <>
      {props.balances && props.balances.length !== 0 && (
        <DashboardPanel
          heading={
            <>
              {translateRaw('EXCLUDED_ASSET_TABLE_HEADER')}{' '}
              <Tooltip tooltip={translateRaw('EXCLUDED_ASSET_TABLE_HEADER_TOOLTIP')} />
            </>
          }
          className={`ExcludedAssetTableList E`}
        >
          <BalanceDetailsTable {...props} createFirstButton={UnHideAssetButton} />
        </DashboardPanel>
      )}
    </>
  );
};

export default ExcludedAssets;
