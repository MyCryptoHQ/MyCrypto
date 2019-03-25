import React from 'react';
import { Panel } from '@mycrypto/ui';
import Slider from 'react-slick';
import styled from 'styled-components';

import translate, { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { BREAK_POINTS, COLORS } from 'v2/features/constants';
import './SliderImports.scss';

import metamaskIcon from 'common/assets/images/wallets/metamask-2.svg';
import trustIcon from 'common/assets/images/wallets/trust-2.svg';
import ledgerIcon from 'common/assets/images/wallets/ledger.svg';
import trezorIcon from 'common/assets/images/wallets/trezor.svg';
import paritySignerIcon from 'common/assets/images/wallets/parity-signer-2.svg';
import safeTIcon from 'common/assets/images/wallets/safe-t.png';

const { SCREEN_SM, SCREEN_LG, SCREEN_XXL } = BREAK_POINTS;
const { DARK_SLATE_BLUE } = COLORS;

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
  width: 140px;
  height: 140px;
  margin-right: 9px;
  margin-left: 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03), 0 1px 0 0 rgba(0, 0, 0, 0.05),
    0 1px 3px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 3px;
  cursor: pointer;
  text-align: center;
`;

const WalletCardContent = styled.div`
  flex-direction: column;
  align-items: center;
  display: ${(props: WalletCardContentProps) => (props.showMobile ? 'none' : 'flex')};

  @media (max-width: ${SCREEN_SM}) {
    display: ${(props: WalletCardContentProps) =>
      (props.showMobile && props.isMobile) || !props.isMobile ? 'flex' : 'none'};
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

interface WalletCardContentProps {
  isMobile: boolean;
  showMobile?: boolean;
}

interface WalletCardProps {
  src: string;
  text: string;
  mobileSrc?: string;
  mobileText?: string;
}

const trackWalletLink = (wallet: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${wallet} wallet button clicked`);
};

const WalletCard: React.SFC<WalletCardProps> = ({ src, text, mobileSrc, mobileText }) => {
  return (
    <WalletCardWrapper className="CompatibleWalletsPanel-wallets-WalletCard">
      <WalletCardContent isMobile={!!mobileSrc} onClick={() => trackWalletLink(text)}>
        <WalletCardImg src={src} alt={text} />
        <WalletCardDescription>{text}</WalletCardDescription>
      </WalletCardContent>
      {mobileSrc && (
        <WalletCardContent
          isMobile={!mobileSrc}
          showMobile={true}
          onClick={() => trackWalletLink(mobileText || text)}
        >
          <WalletCardImg src={mobileSrc} alt={mobileText} />
          <WalletCardDescription>{mobileText}</WalletCardDescription>
        </WalletCardContent>
      )}
    </WalletCardWrapper>
  );
};

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
          <WalletCard
            src={metamaskIcon}
            text={translateRaw('X_METAMASK')}
            mobileSrc={trustIcon}
            mobileText={translateRaw('X_TRUST')}
          />
          <WalletCard src={ledgerIcon} text={translateRaw('X_LEDGER')} />
          <WalletCard src={trezorIcon} text={translateRaw('X_TREZOR')} />
          <WalletCard src={paritySignerIcon} text={translateRaw('X_PARITYSIGNER')} />
          <WalletCard src={safeTIcon} text={translateRaw('X_SAFE_T')} />
        </Slider>
      </Wallets>
    </MainPanel>
  );
}
