import React, { Component } from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import translate, { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { SecureWalletName } from 'v2/config/data';
import './SliderImports.scss';

import metamaskIcon from 'common/assets/images/wallets/metamask-2.svg';
import trustIcon from 'common/assets/images/wallets/trust-2.svg';
import ledgerIcon from 'common/assets/images/wallets/ledger.svg';
import trezorIcon from 'common/assets/images/wallets/trezor.svg';
import paritySignerIcon from 'common/assets/images/wallets/parity-signer.svg';
import safeTIcon from 'common/assets/images/wallets/safe-t.png';

const { SCREEN_SM, SCREEN_LG, SCREEN_XXL } = BREAK_POINTS;
const { DARK_SLATE_BLUE, GREYISH_BROWN } = COLORS;

const MainPanel = styled(Panel)`
  padding: 25px 148px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: ${SCREEN_XXL};
  width: 100%;

  @media (max-width: ${SCREEN_LG}) {
    flex-direction: column;
    text-align: center;
  }

  @media (max-width: ${SCREEN_SM}) {
    padding: 25px 12px 50px 12px;
  }

  .slick-dots {
    bottom: -35px;

    li {
      margin: 0;
      height: 0px;
      width: 16px;
    }

    button:before {
      font-size: 12px;
      color: #ece8e8;
      opacity: 1;
      line-height: 12px;
      width: 12px;
      height: 12px;
    }

    .slick-active button:before {
      color: #c5c2c2;
      opacity: 1;
    }
  }

  @media (min-width: ${SCREEN_SM}) {
    .slick-dots {
      display: none !important;
    }

    .slick-track {
      min-width: 800px !important;
    }
  }
`;

const Header = styled.div`
  margin-right: 40px;
  color: ${GREYISH_BROWN};

  @media (max-width: ${SCREEN_LG}) {
    margin-right: 0px;
  }
`;

const HeaderTitle = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0;
  line-height: normal;
`;

const HeaderDescription = styled.p`
  font-size: 16px;
  font-weight: normal;
  line-height: normal;

  @media (max-width: ${SCREEN_LG}) {
    margin-bottom: 40px;
  }
`;

const Wallets = styled.div`
  max-width: 800px;

  @media (max-width: ${SCREEN_SM}) {
    max-width: 100vw;
  }
`;

const WalletCardWrapper = styled.div`
  background-color: white;
  margin: 3px 9px;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 0 0 rgba(0, 0, 0, 0.05),
    0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

interface WalletCardContentProps {
  isMobile: boolean;
  showMobile?: boolean;
}

// prettier-ignore
const WalletCardContent = styled.div<WalletCardContentProps>`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 140px;
  cursor: pointer;
  display: ${props => (props.showMobile ? 'none' : 'flex')};

  @media (max-width: ${SCREEN_SM}) {
    display: ${props =>
      (props.showMobile && props.isMobile) || !props.isMobile ? 'flex' : 'none'};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const WalletCardImg = styled.img`
  width: auto;
  max-width: 53px;
  height: 53px;
  display: inline;
`;

const WalletCardDescription = styled.p`
  font-size: 13px;
  font-weight: normal;
  color: ${DARK_SLATE_BLUE};
  margin-top: 5px;
`;

interface WalletCardProps {
  src: string;
  text: string;
  mobileSrc?: string;
  mobileText?: string;
  walletName: string;
}

class WalletCard extends Component<WalletCardProps & RouteComponentProps<{}>> {
  public handleWalletClick = (wallet: string) => {
    const { walletName, history } = this.props;
    history.push(`/add-account/${walletName}`);
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${wallet} wallet button clicked`);
  };

  public render() {
    const { src, text, mobileSrc, mobileText } = this.props;
    return (
      <WalletCardWrapper>
        <WalletCardContent isMobile={!!mobileSrc} onClick={() => this.handleWalletClick(text)}>
          <WalletCardImg src={src} alt={text} />
          <WalletCardDescription>{text}</WalletCardDescription>
        </WalletCardContent>
        {mobileSrc && (
          <WalletCardContent
            isMobile={!mobileSrc}
            showMobile={true}
            onClick={() => this.handleWalletClick(mobileText || text)}
          >
            <WalletCardImg src={mobileSrc} alt={mobileText} />
            <WalletCardDescription>{mobileText}</WalletCardDescription>
          </WalletCardContent>
        )}
      </WalletCardWrapper>
    );
  }
}
const WalletCardWithRouter = withRouter(WalletCard);

export default function CompatibleWalletsPanel() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 50,
    slidesToShow: 5,
    arrows: false,
    swipe: false,
    variableWidth: true,
    initialSlide: 2,
    responsive: [
      {
        breakpoint: 820,
        settings: {
          swipe: true,
          slidesToShow: 1,
          centerMode: true,
          swipeToSlide: false,
          initialSlide: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          swipe: true,
          slidesToShow: 1,
          centerMode: true,
          swipeToSlide: true,
          initialSlide: 0
        }
      }
    ]
  };

  return (
    <MainPanel basic={true}>
      <Header>
        <HeaderTitle>{translate('HOME_WALLETS_HEADER')}</HeaderTitle>
        <HeaderDescription>{translate('HOME_WALLETS_DESCRIPTION')}</HeaderDescription>
      </Header>
      <Wallets>
        <Slider {...settings}>
          <WalletCardWithRouter
            src={metamaskIcon}
            text={translateRaw('X_METAMASK')}
            mobileSrc={trustIcon}
            mobileText={translateRaw('X_TRUST')}
            walletName={SecureWalletName.WEB3}
          />
          <WalletCardWithRouter
            src={ledgerIcon}
            text={translateRaw('X_LEDGER')}
            walletName={SecureWalletName.LEDGER_NANO_S}
          />
          <WalletCardWithRouter
            src={trezorIcon}
            text={translateRaw('X_TREZOR')}
            walletName={SecureWalletName.TREZOR}
          />
          <WalletCardWithRouter
            src={paritySignerIcon}
            text={translateRaw('X_PARITYSIGNER')}
            walletName={SecureWalletName.PARITY_SIGNER}
          />
          <WalletCardWithRouter
            src={safeTIcon}
            text={translateRaw('X_SAFE_T')}
            walletName={SecureWalletName.SAFE_T}
          />
        </Slider>
      </Wallets>
    </MainPanel>
  );
}
