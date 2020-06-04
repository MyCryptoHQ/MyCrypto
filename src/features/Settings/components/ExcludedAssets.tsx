import React, { useContext } from 'react';
import styled from 'styled-components';
import { TUuid, Balance, Fiat, IAccount } from '@types';
import { SettingsContext } from '@services/Store';
import { BalanceDetailsTable, Tooltip, AddIcon, DashboardPanel } from '@components';
import { translateRaw } from '@translations';

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
