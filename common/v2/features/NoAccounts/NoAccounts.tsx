import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'v2/translations';
import sadWallet from 'common/assets/images/icn-sad-wallet.svg';

const NoAccountsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 345px;
  height: 506px;
  border-radius: 3px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  background-color: #ffffff;
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 700px) {
    width: 1245px;
    height: 505px;
    margin-top: 6.5em;
    margin-bottom: 6.5em;
  }
`;

const NoAccountsContent = styled.div`
  width: 340px;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
  text-align: center;
  justify-content: center;

  @media (min-width: 700px) {
    width: 503px;
    margin-top: 45px;
  }
`;
const Header = styled.p`
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};
`;

const Description = styled.p`
  height: 48px;
  font-size: 16px;
  padding: 0 30px 0 30px;
  color: ${props => props.theme.text};

  @media (min-width: 700px) {
    font-size: 18px;
    font-weight: normal;
    line-height: 1.5;
  }
`;

const ImgIcon = styled.img`
  width: 130px;
  height: 99px;
  margin: 21px 0 28px 0;
`;

const PrimaryButton = styled(Button)`
  width: 315px;
  margin-bottom: 15px;
  font-size: 17px;
  text-align: center;
  white-space: nowrap;

  @media (min-width: 700px) {
    width: 230px;
  }
`;

const WhiteButtonFirst = styled(Button)`
  width: 315px;
  margin-bottom: 15px;
  font-size: 17px;
  white-space: nowrap;
  text-align: center;
  padding-left: 1.25;

  @media (min-width: 700px) {
    width: 230px;

    &:first-of-type {
      margin-right: 20px;
  }
`;

const WhiteButtonSecond = styled(Button)`
  width: 315px;
  margin-bottom: 15px;
  font-size: 17px;
  white-space: nowrap;
  text-align: center;
  padding-left: 1.1rem;

  @media (min-width: 700px) {
    width: 230px;

`;

const ButtonGroup = styled.div`
  justify-content: center;
  width: 340px;
  flex-direction: column;
  margin-top: 20px;

  @media (min-width: 700px) {
    width: 503px;
  }
`;

export default class NoAccounts extends Component {
  public state = {
    redirect: false
  };
  public handleClick() {
    this.setState({ redirect: true });
  }
  public render() {
    return (
      <NoAccountsContainer>
        <NoAccountsContent className="no-accounts">
          <ImgIcon src={sadWallet} />
          <Header>{translate('NO_ACCOUNTS_HEADER')}</Header>
          <Description>{translate('NO_ACCOUNTS_DESCRIPTION')}</Description>
          <ButtonGroup>
            <Link to="/add-account">
              <WhiteButtonFirst secondary={true} onClick={this.handleClick}>
                Add Existing Account
              </WhiteButtonFirst>
            </Link>
            {/* Link to import settings page */}
            <WhiteButtonSecond secondary={true}>Import MyCrypto Settings</WhiteButtonSecond>
          </ButtonGroup>
          <Link to="/create-wallet">
            <PrimaryButton>Create New Account</PrimaryButton>
          </Link>
        </NoAccountsContent>
      </NoAccountsContainer>
    );
  }
}
