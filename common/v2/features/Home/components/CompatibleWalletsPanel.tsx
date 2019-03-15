import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import Slider from 'react-slick';

import './CompatibleWalletsPanel.scss';
import translate, { translateRaw } from 'translations';

import metamaskIcon from 'common/assets/images/wallets/metamask.png';
import ledgerIcon from 'common/assets/images/wallets/ledger.svg';
import trezorIcon from 'common/assets/images/wallets/trezor.svg';
import paritySignerIcon from 'common/assets/images/wallets/parity-signer-2.svg';
import safeTIcon from 'common/assets/images/wallets/safe-t.png';

interface WalletCardProps {
  src: string;
  text: string;
}

const WalletCard: React.SFC<WalletCardProps> = ({ src, text }) => {
  return (
    <div className="CompatibleWalletsPanel-wallets-WalletCard">
      <img src={src} alt={text} />
      <Typography>{text}</Typography>
    </div>
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
    <Panel basic={true} className="CompatibleWalletsPanel">
      <div className="CompatibleWalletsPanel-heading">
        <Typography className="CompatibleWalletsPanel-heading-name">
          {translate('HOME_WALLETS_HEADER')}
        </Typography>
        <Typography className="CompatibleWalletsPanel-heading-description">
          {translate('HOME_WALLETS_DESCRIPTION')}
        </Typography>
      </div>
      <div className="CompatibleWalletsPanel-wallets">
        <Slider {...settings}>
          <WalletCard src={metamaskIcon} text={translateRaw('X_METAMASK')} />
          <WalletCard src={ledgerIcon} text={translateRaw('X_LEDGER')} />
          <WalletCard src={trezorIcon} text={translateRaw('X_TREZOR')} />
          <WalletCard src={paritySignerIcon} text={translateRaw('X_PARITYSIGNER')} />
          <WalletCard src={safeTIcon} text={translateRaw('X_SAFE_T')} />
        </Slider>
      </div>
    </Panel>
  );
}
