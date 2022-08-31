import styled from 'styled-components';

import { AddIcon, BalanceDetailsTable, DashboardPanel, Tooltip } from '@components';
import { ColumnAction } from '@components/BalanceDetailsTable';
import { useSettings } from '@services/Store';
import { translateRaw } from '@translations';
import { Balance, Fiat, IAccount } from '@types';
import { useScreenSize } from '@utils';

const SIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UnHideAssetButton: ColumnAction = ({ uuid }) => {
  const { removeAssetfromExclusionList } = useSettings();
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
  totalFiatValue: string;
  fiat: Fiat;
  accounts: IAccount[];
  selected: string[];
}

const ExcludedAssets = (props: ExcludedAssetsProps) => {
  const { isMobile } = useScreenSize();
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
          <BalanceDetailsTable
            isMobile={isMobile}
            {...props}
            firstAction={(props) => <UnHideAssetButton {...props} isMobile={isMobile} />}
          />
        </DashboardPanel>
      )}
    </>
  );
};

export default ExcludedAssets;
