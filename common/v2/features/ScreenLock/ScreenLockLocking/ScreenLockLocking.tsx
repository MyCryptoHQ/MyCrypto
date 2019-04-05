import React, { Component } from 'react';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import translate, { translateRaw } from 'translations';

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

type Props = LockScreenProps;

export default class ScreenLockLocking extends Component<Props> {
  public handleKeepUsingDashboardClicked = () => {
    this.props.onCancelLockCountdown();
  };

  public handleTurnOnScreenLockClick = () => {
    this.props.onScreenLockClicked();
  };

  public render() {
    return (
      <MainWrapper>
        <ContentWrapper>
          <Title>{translate('SCREEN_LOCK_LOCKING_HEADING')}</Title>
          <Description>
            {translate('SCREEN_LOCK_LOCKING_DESCRIPTION')}{' '}
            <b>
              {translate('SCREEN_LOCK_LOCKING_SECONDS', {
                $time_left: this.props.timeLeft.toString()
              })}
            </b>
          </Description>
          <PrimaryButton onClick={this.handleKeepUsingDashboardClicked}>
            {translateRaw('SCREEN_LOCK_LOCKING_KEEP_USING')}
          </PrimaryButton>
          <SecondaryButton onClick={this.handleTurnOnScreenLockClick}>
            {translate('SCREEN_LOCK_LOCKING_TURN_ON_LOCK')}
          </SecondaryButton>
        </ContentWrapper>
      </MainWrapper>
    );
  }
}
