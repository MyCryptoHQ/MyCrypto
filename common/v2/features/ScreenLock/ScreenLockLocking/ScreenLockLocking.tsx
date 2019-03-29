import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: center;
  justify-content: center;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(66, 66, 66, 0.8);
`;

const ContentWrapper = styled.div`
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
  width: 420px;
  margin-top: 10px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const SecondaryButton = styled(Button)`
  width: 420px;
  margin-top: 10px;
  font-size: 18px;
  color: white;
  background: none;
  border: solid 2px #ffffff;

  hover: {
    background: #fff;
  }

  @media (min-width: 700px) {
    width: 420px;
  }
`;

type Props = RouteComponentProps<{}>;

let countDownTimer: any = null;
const countDownDuration: number = 59;
export class ScreenLockLocking extends Component<Props> {
  public state = { counter: countDownDuration };

  public componentDidMount() {
    this.setState({ counter: countDownDuration });
    this.startCountDown();
  }

  public componentWillUnmount() {
    clearInterval(countDownTimer);
  }

  public startCountDown = () => {
    const appContext = this;

    countDownTimer = setInterval(() => {
      if (appContext.state.counter === 1) {
        clearInterval(countDownTimer);
        document.title = 'MyCrypto (Locked)';
        appContext.lockScreen();
        return;
      }

      document.title = `Locking Screen in ${appContext.state.counter - 1}`;
      appContext.setState({ counter: appContext.state.counter - 1 });
    }, 1000);
  };

  public lockScreen = () => {
    //TODO: Check if user has already set up the password, navigate to correct route (/screen-lock/locked or /screen-lock/new)
    this.props.history.push('/screen-lock/locked');
  };

  public handleKeepUsingDashboardClicked = () => {
    //TODO: Handle "keep using my crypto" button click
  };

  public handleTurnOnScreenLockClick = () => {
    this.lockScreen();
  };

  public render() {
    return (
      <MainWrapper>
        <ContentWrapper>
          <Title>Are you still using MyCrypto?</Title>
          <Description>
            You’ve been inactive for 5 minutes. In order to keep your funds safe, Your Wallet will
            be automatically locked in <b>{this.state.counter} seconds</b>.
          </Description>
          <PrimaryButton onClick={this.handleKeepUsingDashboardClicked}>
            Keep Using MyCrypto
          </PrimaryButton>
          <SecondaryButton onClick={this.handleTurnOnScreenLockClick}>
            Turn on Screen Lock
          </SecondaryButton>
        </ContentWrapper>
      </MainWrapper>
    );
  }
}

export default withRouter<Props>(ScreenLockLocking);
