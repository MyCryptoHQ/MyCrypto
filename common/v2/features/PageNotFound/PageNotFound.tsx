import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mycrypto/ui';

import translate from 'v2/translations';
import { ROUTE_PATHS } from 'v2/config';

import cryingWallet from 'common/assets/images/icn-sad-wallet.svg';

const PageNotFoundContainer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 345px;
  border-radius: 3px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  background-color: #ffffff;
  text-align: center;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 700px) {
    max-width: 1245px;
    width: 100%;
    margin-top: 6.5em;
    margin-bottom: 6.5em;
  }
`;

const PageNotFoundContent = styled.div`
  width: 340px;
  flex-direction: column;
  align-items: center;
  padding: 18px 4px 26px 4px;
  text-align: center;
  justify-content: center;

  @media (min-width: 700px) {
    width: 503px;
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
  width: 300px;
  margin: 0 0 28px 0;
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

const ButtonGroup = styled.div`
  justify-content: center;
  width: 340px;
  flex-direction: column;
  margin-top: 28px;

  @media (min-width: 700px) {
    width: 503px;
  }
`;

const PageNotFound: React.SFC = () => (
  <PageNotFoundContainer>
    <PageNotFoundContent>
      <ImgIcon src={cryingWallet} />
      <Header>{translate('404_HEADER')}</Header>
      <Description>{translate('404_DESCRIPTION')}</Description>
      <ButtonGroup>
        <Link to={ROUTE_PATHS.ROOT.path}>
          <PrimaryButton>{translate('404_BUTTON')}</PrimaryButton>
        </Link>
      </ButtonGroup>
    </PageNotFoundContent>
  </PageNotFoundContainer>
);

export default PageNotFound;
