import React, { useContext } from 'react';

import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import { BalanceDetailsTable, Currency, DashboardPanel, SubtractIcon, Tooltip } from '@components';
import { SettingsContext } from '@services/Store';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';
import { TUuid } from '@types';

import { BalancesDetailProps } from './types';

const { SCREEN_MD } = BREAK_POINTS;

const BalancesOnly = styled.div`
  width: 100%;

  > section {
    padding: 0;
    margin: 0;
  }
`;

const BackButton = styled(Button)`
  font-weight: bold;
  display: flex;
  align-items: center;

  img {
    margin-right: 13px;
    margin-top: 3px;
  }
`;

const BalancesOnlyTotal = styled.div`
  margin: 0;
  font-size: 20px;
  font-weight: bold;

  @media (min-width: ${SCREEN_MD}) {
    font-size: 24px;
  }
`;
const SIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const HideAssetButton = ({ uuid, key }: { uuid: TUuid; key: string }) => {
  const { addAssetToExclusionList } = useContext(SettingsContext);
  return (
    <SIconContainer key={key} onClick={() => addAssetToExclusionList(uuid)}>
      <Tooltip tooltip={translateRaw('HIDE_ASSET_TOOLTIP')}>
        <SIconContainer>
          <SubtractIcon size="xl" />
        </SIconContainer>
      </Tooltip>
    </SIconContainer>
  );
};

const BalancesDetailView = (props: BalancesDetailProps) => {
  const BALANCES = translateRaw('WALLET_BREAKDOWN_BALANCES');
  const { toggleShowChart, totalFiatValue, fiat } = props;
  return (
    <BalancesOnly>
      <DashboardPanel
        heading={
          <BackButton basic={true} onClick={toggleShowChart}>
            <img src={backArrowIcon} alt="Back arrow" /> {BALANCES}
          </BackButton>
        }
        headingRight={
          <BalancesOnlyTotal>
            <Currency
              amount={totalFiatValue.toString()}
              symbol={fiat.symbol}
              ticker={fiat.ticker}
              decimals={2}
            />
          </BalancesOnlyTotal>
        }
      >
        <BalanceDetailsTable {...props} createFirstButton={HideAssetButton} />
      </DashboardPanel>
    </BalancesOnly>
  );
};

export default BalancesDetailView;
