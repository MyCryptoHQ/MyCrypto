import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import backArrowIcon from '@assets/images/icn-back-arrow.svg';
import {
  BalanceDetailsTable,
  Box,
  Currency,
  DashboardPanel,
  LinkApp,
  SubtractIcon,
  Tooltip
} from '@components';
import { useSettings } from '@services/Store';
import { BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';
import { TUuid } from '@types';
import { useScreenSize } from '@utils';

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

export const HideAssetButton = ({
  uuid,
  key,
  isMobile
}: {
  uuid: TUuid;
  key: string;
  isMobile: boolean;
}) => {
  const { addAssetToExclusionList } = useSettings();
  return (
    <>
      {isMobile ? (
        <Box key={key} onClick={() => addAssetToExclusionList(uuid!)}>
          <LinkApp href="#">{translateRaw('HIDE_ASSET')}</LinkApp>
        </Box>
      ) : (
        <Box variant="rowCenter" key={key} onClick={() => addAssetToExclusionList(uuid!)}>
          <Tooltip tooltip={translateRaw('HIDE_ASSET_TOOLTIP')}>
            <Box variant="rowCenter">
              <SubtractIcon size="xl" />
            </Box>
          </Tooltip>
        </Box>
      )}
    </>
  );
};

const BalancesDetailView = (props: BalancesDetailProps) => {
  const BALANCES = translateRaw('WALLET_BREAKDOWN_BALANCES');
  const { toggleShowChart, totalFiatValue, fiat } = props;
  const { isMobile } = useScreenSize();

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
              bold={true}
              amount={totalFiatValue.toString()}
              symbol={fiat.symbol}
              ticker={fiat.ticker}
              decimals={2}
            />
          </BalancesOnlyTotal>
        }
      >
        <BalanceDetailsTable
          {...props}
          isMobile={isMobile}
          firstAction={(props) => <HideAssetButton {...props} isMobile={isMobile} />}
        />
      </DashboardPanel>
    </BalancesOnly>
  );
};

export default BalancesDetailView;
