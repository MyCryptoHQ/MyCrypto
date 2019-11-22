import React from 'react';
import styled from 'styled-components';

import translate from 'v2/translations';

import sadWallet from 'common/assets/images/icn-sad-wallet.svg';

const NoAccountsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 450px;
  text-align: center;
  padding: 0 15px;
`;

const Header = styled.p`
  font-size: 24px;
  font-weight: bold;
  line-height: normal;
  color: ${props => props.theme.headline};
`;

const Description = styled.p`
  height: 48px;
  font-size: 16px;
  font-weight: normal;
  padding: 0 30px;
  color: ${props => props.theme.text};

  @media (min-width: 700px) {
    font-size: 18px;
  }
`;

const ImgIcon = styled.img`
  width: 130px;
  height: 99px;
  margin: 21px 0 28px 0;
`;

export default function NoAccountsSelected() {
  return (
    <NoAccountsWrapper>
      <ImgIcon src={sadWallet} />
      <Header>{translate('NO_ACCOUNTS_SELECTED_HEADER')}</Header>
      <Description>{translate('NO_ACCOUNTS_SELECTED_DESCRIPTION')}</Description>
    </NoAccountsWrapper>
  );
}
