import React, { FC, useCallback } from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import translate, { translateRaw } from '@translations';
import { ANALYTICS_CATEGORIES } from '@services';
import { BREAK_POINTS, COLORS } from '@theme';
import { WalletId } from '@types';
import { ROUTE_PATHS } from '@config';

import './SliderImports.scss';
import metamaskIcon from '@assets/images/wallets/metamask.svg';
import trustIcon from '@assets/images/wallets/trust-2.svg';
import ledgerIcon from '@assets/images/wallets/ledger.svg';
import trezorIcon from '@assets/images/wallets/trezor.svg';
import frameIcon from '@assets/images/wallets/frame.svg';
import walletConnectIcon from '@assets/images/wallets/walletconnect.svg';
import { useAnalytics } from '@utils';

const { SCREEN_SM, SCREEN_LG, SCREEN_XXL } = BREAK_POINTS;
const { BLUE_DARK_SLATE, GREYISH_BROWN } = COLORS;

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
  max-height: 53px;
  height: 53px;
  display: block;
`;

const WalletCardDescription = styled.p`
  font-size: 13px;
  font-weight: normal;
  color: ${BLUE_DARK_SLATE};
  margin-top: 5px;
`;

interface WalletCardProps {
  src: string;
  text: string;
  mobileSrc?: string;
  mobileText?: string;
  mobileWalletId?: string;
  walletId: string;
}

const WalletCard: FC<WalletCardProps & RouteComponentProps> = ({
  src,
  text,
  mobileSrc,
  mobileText,
  walletId,
  mobileWalletId,
  history
}) => {
  const trackWallet = useAnalytics({
    category: ANALYTICS_CATEGORIES.HOME
  });

  const handleWalletClick = useCallback(
    (walletText: string, walletIdRedirect: string) => {
      history.push(`${ROUTE_PATHS.ADD_ACCOUNT.path}/${walletIdRedirect}`);
      trackWallet({
        actionName: `${walletText} wallet button clicked`
      });
    },
    [history]
  );

  return (
    <WalletCardWrapper>
      <WalletCardContent isMobile={!!mobileSrc} onClick={() => handleWalletClick(text, walletId)}>
        <WalletCardImg src={src} alt={text} />
        <WalletCardDescription>{text}</WalletCardDescription>
      </WalletCardContent>
      {mobileSrc && (
        <WalletCardContent
          isMobile={!mobileSrc}
          showMobile={true}
          onClick={() => handleWalletClick(mobileText || text, mobileWalletId || walletId)}
        >
          <WalletCardImg src={mobileSrc} alt={mobileText} />
          <WalletCardDescription>{mobileText}</WalletCardDescription>
        </WalletCardContent>
      )}
    </WalletCardWrapper>
  );
};
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
            walletId={WalletId.WEB3}
          />
          <WalletCardWithRouter
            src={ledgerIcon}
            text={translateRaw('X_LEDGER')}
            mobileSrc={ledgerIcon}
            mobileText={translateRaw('X_LEDGER')}
            walletId={WalletId.LEDGER_NANO_S}
          />
          <WalletCardWithRouter
            src={trezorIcon}
            text={translateRaw('X_TREZOR')}
            walletId={WalletId.TREZOR}
          />
          <WalletCardWithRouter
            src={walletConnectIcon}
            text={translateRaw('X_WALLETCONNECT')}
            walletId={WalletId.WALLETCONNECT}
            mobileSrc={metamaskIcon}
            mobileText={translateRaw('X_METAMASK')}
            mobileWalletId={WalletId.WEB3}
          />
          <WalletCardWithRouter
            src={frameIcon}
            text={translateRaw('X_FRAME')}
            walletId={WalletId.WEB3}
            mobileSrc={walletConnectIcon}
            mobileText={translateRaw('X_WALLETCONNECT')}
            mobileWalletId={WalletId.WALLETCONNECT}
          />
        </Slider>
      </Wallets>
    </MainPanel>
  );
}
