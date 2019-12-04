import React from 'react';
import styled from 'styled-components';
import { Panel } from '@mycrypto/ui';

import translate from 'v2/translations';
import { COLORS, BREAK_POINTS } from 'v2/theme';

import manageWalletsImage from 'common/assets/images/manage-your-wallets.svg';
import viewDashboardImage from 'common/assets/images/view-dashboard.svg';
import yourCryptoImage from 'common/assets/images/control-crypto.svg';

import manageWalletsImageMobile from 'common/assets/images/manage-your-wallets-mobile.svg';
import viewDashboardImageMobile from 'common/assets/images/view-dashboard-mobile.svg';
import yourCryptoImageMobile from 'common/assets/images/control-crypto-mobile.svg';

const { SCREEN_SM, SCREEN_MD, SCREEN_LG, SCREEN_XL, SCREEN_XXL } = BREAK_POINTS;
const { DARK_SLATE_BLUE } = COLORS;

const MainPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 88px 148px;
  max-width: ${SCREEN_XXL};

  @media (max-width: ${SCREEN_SM}) {
    padding: 42px 0;
  }
`;

const TitleArea = styled.div`
  text-align: center;

  @media (max-width: ${SCREEN_SM}) {
    margin-bottom: 20px;
    padding: 0 12px;
  }
`;

const Title = styled.p`
  font-size: 35px;
  font-weight: bold;
  color: ${DARK_SLATE_BLUE};
  line-height: 1.5;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 23px;
  }
`;

const Description = styled.p`
  font-size: 30px;
  line-height: 1.5;
  margin-top: 8px;
  font-weight: normal;
  color: ${DARK_SLATE_BLUE};

  @media (max-width: ${SCREEN_SM}) {
    font-size: 16px;
  }
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 32px;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 0;
  }
`;

interface FeatureWrapperProps {
  captionRight: boolean;
}

// prettier-ignore
const FeatureWrapper = styled.div<FeatureWrapperProps>`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 80px;
  ${props => props.captionRight && 'text-align: right;'}

  @media (min-width: ${SCREEN_LG}) {
    flex-direction: ${props => (props.captionRight ? 'row-reverse' : 'row')};
  }

  @media (max-width: ${SCREEN_LG}) {
    flex-direction: column;
    margin-bottom: 0;
  }
`;

const FeatureCaptions = styled.div`
  max-width: 500px;
  width: 50%;
  @media (max-width: ${SCREEN_LG}) {
    width: 100%;
    order: 1;
  }
  @media (max-width: ${SCREEN_SM}) {
    padding: 0 12px;
  }
`;

const FeatureTitle = styled.p`
  font-size: 30px;
  font-weight: bold;
  color: ${DARK_SLATE_BLUE};
  line-height: normal;

  @media (min-width: ${SCREEN_XL}) {
    font-size: 30px;
  }
  @media (max-width: ${SCREEN_LG}) {
    margin-top: 80px;
    text-align: center;
  }
  @media (max-width: ${SCREEN_SM}) {
    margin-top: 30px;
    font-size: 20px;
    text-align: center;
    width: 100%;
  }
`;

const FeatureDescription = styled.p`
  font-size: 21px;
  line-height: 1.5;
  margin-top: 8px;
  font-weight: normal;
  color: ${DARK_SLATE_BLUE};

  @media (min-width: ${SCREEN_XL}) {
    font-size: 21px;
  }
  @media (max-width: ${SCREEN_LG}) {
    text-align: center;
  }
  @media (max-width: ${SCREEN_SM}) {
    font-size: 16px;
  }
`;

const FeatureImage = styled.img`
  width: auto;
  max-width: 70%;
  max-height: 550px;

  @media (max-width: ${SCREEN_LG}) {
    margin-top: 24px;
    order: 2;
  }

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const FeatureMobileImage = styled.img`
  display: none;

  @media (max-width: ${SCREEN_SM}) {
    display: block;
    order: 2;
  }

  @media (max-width: 420px) {
    width: 100%;
  }
`;

interface FeatureProps {
  name: React.ReactElement<any>;
  description: React.ReactElement<any>;
  image: string;
  mobileImage: string;
  captionRight: boolean;
}

const Feature: React.SFC<FeatureProps> = props => {
  const { name, description, image, mobileImage, captionRight } = props;
  return (
    <FeatureWrapper captionRight={captionRight}>
      <FeatureCaptions>
        <FeatureTitle>{name}</FeatureTitle>
        <FeatureDescription>{description}</FeatureDescription>
      </FeatureCaptions>
      <FeatureImage src={image} />
      <FeatureMobileImage src={mobileImage} />
    </FeatureWrapper>
  );
};

export default function FeaturesPanel() {
  return (
    <MainPanel basic={true}>
      <TitleArea>
        <Title>{translate('HOME_FEATURES_TITLE')}</Title>
        <Description>{translate('HOME_FEATURES_DESCRIPTION')}</Description>
      </TitleArea>
      <FeaturesSection>
        <Feature
          name={translate('HOME_FEATURES_MANAGE_TITLE')}
          description={translate('HOME_FEATURES_MANAGE_DESCRIPTION')}
          image={manageWalletsImage}
          mobileImage={manageWalletsImageMobile}
          captionRight={false}
        />
        <Feature
          name={translate('HOME_FEATURES_VIEW_TITLE')}
          description={translate('HOME_FEATURES_VIEW_DESCRIPTION')}
          image={viewDashboardImage}
          mobileImage={viewDashboardImageMobile}
          captionRight={true}
        />
        <Feature
          name={translate('HOME_FEATURES_CONTROL_TITLE')}
          description={translate('HOME_FEATURES_CONTROL_DESCRIPTION')}
          image={yourCryptoImage}
          mobileImage={yourCryptoImageMobile}
          captionRight={false}
        />
      </FeaturesSection>
    </MainPanel>
  );
}
