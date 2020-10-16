import React from 'react';

import { Button } from '@mycrypto/ui';
import { connect, ConnectedProps } from 'react-redux';
import styled from 'styled-components';

import { AppState, getInactivityTimer } from '@store';
import translate, { translateRaw } from '@translations';
import { formatTimeDuration } from '@utils';

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

  :hover {
    background: #fff;
  }
`;

interface LockScreenProps {
  timeLeft: number;
  lockingOnDemand: boolean;
  onScreenLockClicked(): void;
  onCancelLockCountdown(): void;
}

function ScreenLockLocking({
  timeLeft,
  onScreenLockClicked,
  onCancelLockCountdown,
  lockingOnDemand,
  inactivityTimer
}: LockScreenProps & Props) {
  const handleKeepUsingDashboardClicked = () => {
    onCancelLockCountdown();
  };

  const handleTurnOnScreenLockClick = () => {
    onScreenLockClicked();
  };

  return (
    <MainWrapper>
      <ContentWrapper>
        <Title>{translate('SCREEN_LOCK_LOCKING_HEADING')}</Title>
        <Description>
          {translate(
            lockingOnDemand
              ? 'SCREEN_LOCK_LOCKING_ON_DEMAND_DESCRIPTION'
              : 'SCREEN_LOCK_LOCKING_DESCRIPTION',
            {
              $inactive_time: formatTimeDuration(Math.floor((Date.now() - inactivityTimer) / 1000))
            }
          )}{' '}
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

const mapStateToProps = (state: AppState) => ({
  inactivityTimer: getInactivityTimer(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector>;

export default connector(ScreenLockLocking);
