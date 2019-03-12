import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';
import Slider from 'react-slick';

import './CompatibleWalletsPanel.scss';
import metamaskIcon from 'common/assets/images/wallets/metamask.png';
import ledgerIcon from 'common/assets/images/wallets/ledger.png';
import trezorIcon from 'common/assets/images/wallets/trezor.png';
import paritySignerIcon from 'common/assets/images/wallets/parity-signer.png';
import safeTIcon from 'common/assets/images/wallets/safe-t.png';

interface WalletCardProps {
  src: string;
  alt: string;
  text: string;
}

const WalletCard = ({ src, alt, text }: WalletCardProps) => {
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
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    variableWidth: true
  };

  return (
    <Panel className="CompatibleWalletsPanel">
      <div className="CompatibleWalletsPanel-heading">
        <Typography>Fully Compatible</Typography>
        <Typography>Use with your favorite hardware and software wallets:</Typography>
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
