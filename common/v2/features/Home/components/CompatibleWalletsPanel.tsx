import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import Slider from 'react-slick';

import './CompatibleWalletsPanel.scss';
import metamaskIcon from 'common/assets/images/wallets/metamask.png';
import ledgerIcon from 'common/assets/images/wallets/ledger.svg';
import trezorIcon from 'common/assets/images/wallets/trezor.svg';
import paritySignerIcon from 'common/assets/images/wallets/parity-signer-2.svg';
import safeTIcon from 'common/assets/images/wallets/safe-t.png';

interface WalletCardProps {
  src: string;
  alt: string;
  text: string;
}

const WalletCard: React.SFC<WalletCardProps> = ({ src, alt, text }) => {
  return (
    <div className="CompatibleWalletsPanel-wallets-WalletCard">
      <img src={src} alt={alt} />
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
    responsive: [
      {
        breakpoint: 820,
        settings: {
          swipe: true,
          slidesToShow: 1,
          centerMode: true,
          swipeToSlide: true
        }
      }
    ]
  };

  return (
    <Panel basic={true} className="CompatibleWalletsPanel">
      <div className="CompatibleWalletsPanel-heading">
        <Typography className="CompatibleWalletsPanel-heading-name">Fully Compatible</Typography>
        <Typography className="CompatibleWalletsPanel-heading-description">
          Use with your favorite hardware and software wallets:
        </Typography>
      </div>
      <div className="CompatibleWalletsPanel-wallets">
        <Slider {...settings}>
          <WalletCard src={metamaskIcon} alt={'metamask'} text={'Metamask'} />
          <WalletCard src={ledgerIcon} alt={'ledger'} text={'Ledger'} />
          <WalletCard src={trezorIcon} alt={'trezor'} text={'Trezor'} />
          <WalletCard src={paritySignerIcon} alt={'parity signer'} text={'Parity Signer'} />
          <WalletCard src={safeTIcon} alt={'safe t'} text={'Safe-T Mini'} />
        </Slider>
      </div>
    </Panel>
  );
}
