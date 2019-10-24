import React, { useContext } from 'react';
import moment from 'moment';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate, { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services/ApiService';

import { SettingsContext } from 'v2/services/Store';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: center;
  justify-content: center;
  z-index: 10;
  width: 100%;
  height: 100%;
  padding: 12px;
  background-color: rgba(66, 66, 66, 0.8);
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 540px;
  text-align: center;
`;

const Title = styled.p`
  font-size: 32px;
  color: white;
  font-weight: bold;
`;

const Description = styled.p`
  font-size: 24px;
  color: white;
  line-height: 1.5;
`;

const PrimaryButton = styled(Button)`
  width: 100%;
  max-width: 420px;
  margin-top: 10px;
  font-size: 18px;
`;

const SecondaryButton = styled(Button)`
  width: 100%;
  max-width: 420px;
  margin-top: 10px;
  font-size: 18px;
  color: white;
  background: none;
  border: solid 2px #ffffff;

  hover: {
    background: #fff;
  }
`;

interface LockScreenProps {
  timeLeft: number;
  onScreenLockClicked(): void;
  onCancelLockCountdown(): void;
}

export default function ScreenLockLocking({
  timeLeft,
  onScreenLockClicked,
  onCancelLockCountdown
}: LockScreenProps) {
  const { settings } = useContext(SettingsContext);

  const handleKeepUsingDashboardClicked = () => {
    onCancelLockCountdown();
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.SCREEN_LOCK,
      'Keep Using MyCrypto button clicked'
    );
  };

  const handleTurnOnScreenLockClick = () => {
    onScreenLockClicked();
    AnalyticsService.instance.track(
      ANALYTICS_CATEGORIES.SCREEN_LOCK,
      'Turn On Screenlock button clicked'
    );
  };

  return (
    <MainWrapper>
      <ContentWrapper>
        <Title>{translate('SCREEN_LOCK_LOCKING_HEADING')}</Title>
        <Description>
          {translate(`SCREEN_LOCK_LOCKING_DESCRIPTION`, {
            $inactive_time: moment.duration(settings.inactivityTimer).humanize()
          })}{' '}
          <b>
            {translate('SCREEN_LOCK_LOCKING_SECONDS', {
              $time_left: timeLeft.toString()
            })}
          </b>
        </Description>
        <PrimaryButton onClick={handleKeepUsingDashboardClicked}>
          {translateRaw('SCREEN_LOCK_LOCKING_KEEP_USING')}
        </PrimaryButton>
        <SecondaryButton onClick={handleTurnOnScreenLockClick}>
          {translate('SCREEN_LOCK_LOCKING_TURN_ON_LOCK')}
        </SecondaryButton>
      </ContentWrapper>
    </MainWrapper>
  );
}
