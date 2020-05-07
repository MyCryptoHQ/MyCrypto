import React from 'react';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { COLORS, BREAK_POINTS } from 'v2/theme';

import bankIcon from 'common/assets/images/illo-bank.svg';
import myCryptoIcon from 'common/assets/images/illo-with-mycrypto.svg';

const { SCREEN_SM, SCREEN_MD, SCREEN_XXL } = BREAK_POINTS;
const { GREYISH_BROWN } = COLORS;

const MainPanel = styled(Panel)`
display: flex;
flex-direction: column;
align-items: center;
flex: 1;
padding: 120px;
max-width: ${SCREEN_XXL};

@media (max-width: ${SCREEN_MD}}) {
  padding: 88px 148px;
}

@media (max-width: ${SCREEN_SM}) {
  padding: 42px 12px;
}
`;

const Title = styled.p`
  font-size: 35px;
  font-weight: bold;
  color: ${GREYISH_BROWN};
  line-height: normal;
  text-align: center;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 23px;
    padding: 0 90px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 96px;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
    margin-top: 0;
  }
`;

const ContentItemWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 50px;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 44px;
  }
`;

const ContentItemImage = styled.img`
  height: 212px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 32px;
    height: 168px;
    width: auto;
  }

  @media (max-width: ${SCREEN_SM}) {
    margin-top: 0;
    height: 128px;
    width: auto;
  }
`;

const ContentItemDescription = styled.p`
  font-size: 30px;
  font-weight: normal;
  line-height: 1.5;
  white-space: pre-line;
  min-width: 400px;
  color: ${GREYISH_BROWN};

  @media (max-width: ${SCREEN_MD}) {
    font-size: 24px;
    max-width: 300px;
  }
  @media (max-width: ${SCREEN_SM}) {
    font-size: 18px;
    max-width: 244px;
  }
`;

const ContentItemTitle = styled(ContentItemDescription)`
  line-height: 1;
  font-weight: bold;
  margin-top: 32px;
`;

interface ContentItemProps {
  icon: string;
  description: string;
  title: string;
}

const ContentItem: React.FC<ContentItemProps> = (props) => {
  const { icon, title, description } = props;
  return (
    <ContentItemWrapper>
      <ContentItemImage src={icon} />
      <ContentItemTitle>{title}</ContentItemTitle>
      <ContentItemDescription>{description}</ContentItemDescription>
    </ContentItemWrapper>
  );
};

export default function KeepYourAssetsSafePanel() {
  return (
    <MainPanel basic={true}>
      <Title>{translateRaw('HOME_KEEP_SAFE_TITLE')}</Title>
      <Content>
        <ContentItem
          icon={bankIcon}
          title={translateRaw('HOME_KEEP_SAFE_BANKS_TITLE')}
          description={translateRaw('HOME_KEEP_SAFE_BANKS_DESCRIPTION')}
        />
        <ContentItem
          icon={myCryptoIcon}
          title={translateRaw('HOME_KEEP_SAFE_MYCRYPTO_TITLE')}
          description={translateRaw('HOME_KEEP_SAFE_MYCRYPTO_DESCRIPTION')}
        />
      </Content>
    </MainPanel>
  );
}
