import React, { Component } from 'react';
import styled from 'styled-components';
import { Layout } from 'v2/features';
import sadWallet from 'common/assets/images/icn-sad-wallet.svg';
import { Button } from '@mycrypto/ui';

const NoAccountsContainer = styled.div`
  width: 1245px;
  height: 505px;
  border-radius: 3px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  background-color: #ffffff;
  justify-content: center, 
  align-content:center, 
`;

const NoAccountsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
  text-align: center;
`;
const Header = styled.p`
  font-size: 32px;
  font-weight: bold;
  line-height: normal;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.headline};
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: normal;
  line-height: 1.5;
  padding: 0 30px 0 30px;
  color: ${props => props.theme.text};
`;

const ImgIcon = styled.img`
  width: 135px;
  height: 135px;
  margin: 21px 0 28px 0;
`;

const PrimaryButton = styled(Button)`
  width: 320px;
  margin-bottom: 15px;
  font-size: 18px;

  @media (min-width: 700px) {
    width: 420px;
  }
`;

const WhiteButton = styled(Button)`
  width: 320px;
  margin-bottom: 15px;
  font-size: 17px;

  @media (min-width: 700px) {
    width: 200px;

    &:first-of-type {
      margin-right: 20px;
    }
  }
`;

export default class NoAccounts extends Component {
  public render() {
    return (
      <Layout centered={true}>
        <NoAccountsContainer>
          <NoAccountsContent>
            <ImgIcon src={sadWallet} />
            <Header>You dont have any accounts in your wallet.</Header>
            <Description>
              To access your funds add one of your existing accounts or create a new accounts now.
            </Description>
            <WhiteButton secondary={true}>Add Existing Account</WhiteButton>
            <WhiteButton secondary={true}>Import MyCrypto Settings</WhiteButton>
            <PrimaryButton>Create New Account</PrimaryButton>
          </NoAccountsContent>
        </NoAccountsContainer>
      </Layout>
    );
  }
}
