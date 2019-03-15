import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';

import './FeaturesPanel.scss';

import manageWalletsImage from 'common/assets/images/manage-your-wallets.svg';
import viewDashboardImage from 'common/assets/images/view-dashboard.svg';
import yourCryptoImage from 'common/assets/images/control-crypto.svg';

import manageWalletsImageMobile from 'common/assets/images/manage-your-wallets-mobile.svg';
import viewDashboardImageMobile from 'common/assets/images/view-dashboard-mobile.svg';
import yourCryptoImageMobile from 'common/assets/images/control-crypto-mobile.svg';

interface FeatureProps {
  name: string;
  description: string;
  image: string;
  mobileImage: string;
  captionLeft: boolean;
}

const Feature: React.SFC<FeatureProps> = props => {
  const { name, description, image, mobileImage, captionLeft } = props;
  return (
    <div className="feature">
      {captionLeft && (
        <div className="captions">
          <Typography className="title">{name}</Typography>
          <Typography className="description">{description}</Typography>
        </div>
      )}
      <img className="image" src={image} />
      <img className="mobileImage" src={mobileImage} />

      {!captionLeft && (
        <div className="captions">
          <div style={{ textAlign: 'right' }}>
            <Typography className="title">{name}</Typography>
            <Typography className="description">{description}</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default function FeaturesPanel() {
  return (
    <Panel basic className="FeaturesPanel">
      <div className="titleArea">
        <Typography className="title">
          Managing and storing your assets has never been easier.
        </Typography>
        <Typography className="description">
          The MyCrypto apps put your safety & security first.
        </Typography>
      </div>
      <div className="featuresSection">
        <Feature
          name="Manage Your Wallets"
          description="MyCrypto allows you to create, import, and manage all the wallets you'll ever need."
          image={manageWalletsImage}
          mobileImage={manageWalletsImageMobile}
          captionLeft={true}
        />
        <Feature
          name="View Your Dashboard"
          description="See a detailed breakdown of all your wallets, tokens, and transactions."
          image={viewDashboardImage}
          mobileImage={viewDashboardImageMobile}
          captionLeft={false}
        />
        <Feature
          name="Control Your Crypto"
          description="Manage your information and your cryptocurrency easily and without fear."
          image={yourCryptoImage}
          mobileImage={yourCryptoImageMobile}
          captionLeft={true}
        />
      </div>
    </Panel>
  );
}
