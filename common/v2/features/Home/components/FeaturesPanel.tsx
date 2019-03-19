import React from 'react';
import { Panel, Typography } from '@mycrypto/ui';

import './FeaturesPanel.scss';
import translate from 'translations';

import manageWalletsImage from 'common/assets/images/manage-your-wallets.svg';
import viewDashboardImage from 'common/assets/images/view-dashboard.svg';
import yourCryptoImage from 'common/assets/images/control-crypto.svg';

import manageWalletsImageMobile from 'common/assets/images/manage-your-wallets-mobile.svg';
import viewDashboardImageMobile from 'common/assets/images/view-dashboard-mobile.svg';
import yourCryptoImageMobile from 'common/assets/images/control-crypto-mobile.svg';

interface FeatureProps {
  name: React.ReactElement<any>;
  description: React.ReactElement<any>;
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
    <Panel basic={true} className="FeaturesPanel">
      <div className="titleArea">
        <Typography className="title">{translate('HOME_FEATURES_TITLE')}</Typography>
        <Typography className="description">{translate('HOME_FEATURES_DESCRIPTION')}</Typography>
      </div>
      <div className="featuresSection">
        <Feature
          name={translate('HOME_FEATURES_MANAGE_TITLE')}
          description={translate('HOME_FEATURES_MANAGE_DESCRIPTION')}
          image={manageWalletsImage}
          mobileImage={manageWalletsImageMobile}
          captionLeft={true}
        />
        <Feature
          name={translate('HOME_FEATURES_VIEW_TITLE')}
          description={translate('HOME_FEATURES_VIEW_DESCRIPTION')}
          image={viewDashboardImage}
          mobileImage={viewDashboardImageMobile}
          captionLeft={false}
        />
        <Feature
          name={translate('HOME_FEATURES_CONTROL_TITLE')}
          description={translate('HOME_FEATURES_CONTROL_DESCRIPTION')}
          image={yourCryptoImage}
          mobileImage={yourCryptoImageMobile}
          captionLeft={true}
        />
      </div>
    </Panel>
  );
}
