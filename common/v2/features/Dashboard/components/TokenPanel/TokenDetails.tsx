import React from 'react';
import styled from 'styled-components';
import { formatEther } from 'ethers/utils';

import { translateRaw } from 'translations';
import { AssetWithDetails, TSymbol } from 'v2/types';
import { DashboardPanel, AssetIcon } from 'v2/components';

import socialTelegram from 'common/assets/images/social-icons/social-telegram.svg';
import socialTwitter from 'common/assets/images/social-icons/social-twitter.svg';
import socialReddit from 'common/assets/images/social-icons/social-reddit.svg';
import socialGithub from 'common/assets/images/social-icons/social-github.svg';
import socialFacebook from 'common/assets/images/social-icons/social-facebook.svg';
import socialSlack from 'common/assets/images/social-icons/social-slack.svg';
import socialCmc from 'common/assets/images/social-icons/social-cmc.svg';
import websiteIcon from 'common/assets/images/icn-website.svg';
import whitepaperIcon from 'common/assets/images/icn-whitepaper.svg';
import backArrowIcon from 'common/assets/images/icn-back.svg';
import expandIcon from 'common/assets/images/icn-expand.svg';

const etherscanUrl = ' https://etherscan.io/token/';

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const InfoTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #000;
  text-transform: uppercase;
`;

const InfoValue = styled.div`
  font-size: 18px;
  font-weight: normal;
`;

interface SectionProps {
  noMargin?: boolean;
}

const Section = styled.div<SectionProps>`
  margin-top: ${props => (props.noMargin ? 0 : '23px')};
`;

const TwoColumnsWrapper = styled.div`
  display: flex;
`;

const Icon = styled.img`
  width: 24px;
  height: auto;
  cursor: pointer;
  margin-right: 21px;
`;

const Resources = styled.div`
  display: flex;
`;

const ResourceItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 21px;
  cursor: pointer;
  color: #000;
`;

const ResourceIcon = styled(Icon)`
  margin-right: 10px;
`;

const BackIcon = styled(Icon)`
  margin-right: 16px;
`;

const TokenIcon = styled.div`
  margin-right: 8px;
  display: flex;
`;

const DetailsHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface InfoPieceProps {
  title: string;
  value: string | number | JSX.Element | undefined;
}

function InfoPiece(props: InfoPieceProps) {
  const { title, value } = props;
  return (
    <InfoWrapper>
      <InfoTitle>{title}</InfoTitle>
      <InfoValue>{value}</InfoValue>
    </InfoWrapper>
  );
}

interface ISocialNetwork {
  [index: string]: { name: string; icon: string };
}

const supportedSocialNetworks: ISocialNetwork = {
  telegram: {
    name: 'telegram',
    icon: socialTelegram
  },
  twitter: {
    name: 'twitter',
    icon: socialTwitter
  },
  reddit: {
    name: 'reddit',
    icon: socialReddit
  },
  github: {
    name: 'github',
    icon: socialGithub
  },
  facebook: {
    name: 'facebook',
    icon: socialFacebook
  },
  slack: {
    name: 'slack',
    icon: socialSlack
  },
  cmc: {
    name: 'coin market cap',
    icon: socialCmc
  }
};

interface Props {
  currentToken: AssetWithDetails;
  setShowDetailsView(setShowDetailsView: boolean): void;
}

export function TokenDetails(props: Props) {
  const { currentToken, setShowDetailsView } = props;
  const { details } = currentToken;

  interface ISocial {
    [index: string]: string;
  }

  // Find available supported social links
  const filteredSocial = (details.social || {}) as ISocial;
  Object.keys(filteredSocial).forEach(
    key =>
      (!filteredSocial[key] || !supportedSocialNetworks.hasOwnProperty(key)) &&
      delete filteredSocial[key]
  );
  const filteredSocialArray = Object.keys(filteredSocial);

  return (
    <DashboardPanel
      heading={
        <DetailsHeadingWrapper>
          <BackIcon src={backArrowIcon} onClick={() => setShowDetailsView(false)} />
          <TokenIcon>
            <AssetIcon symbol={currentToken.ticker as TSymbol} size={'26px'} />
          </TokenIcon>
          {currentToken.name}
        </DetailsHeadingWrapper>
      }
      headingRight={
        <a href={`${etherscanUrl}${currentToken.contractAddress}`} target="_blank" rel="noreferrer">
          <Icon src={expandIcon} />
        </a>
      }
      padChildren={true}
    >
      <Section noMargin={true}>
        <TwoColumnsWrapper>
          {/*TODO: Look up selected fiat currency instead of hardcoded $*/}
          <InfoPiece title={translateRaw('LATEST_PRICE')} value={'$' + currentToken.rate} />{' '}
          <InfoPiece
            title={translateRaw('BALANCE')}
            value={`${formatEther(currentToken.balance)} ${currentToken.ticker}`}
          />
        </TwoColumnsWrapper>
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_ADDRESS')} value={currentToken.contractAddress} />
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_DECIMALS')} value={currentToken.decimal} />
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_SYMBOL')} value={currentToken.ticker} />
      </Section>
      {(details.website || details.whitepaper) && (
        <Section>
          <InfoPiece
            title={translateRaw('RESOURCES')}
            value={
              <Resources>
                {details.website && (
                  <a href={details.website} target="_blank" rel="noreferrer">
                    <ResourceItem>
                      <ResourceIcon src={websiteIcon} />
                      {translateRaw('WEBSITE')}
                    </ResourceItem>
                  </a>
                )}
                {details.whitepaper && (
                  <a href={details.whitepaper} target="_blank" rel="noreferrer">
                    <ResourceItem>
                      <ResourceIcon src={whitepaperIcon} />
                      {translateRaw('WHITEPAPER')}
                    </ResourceItem>
                  </a>
                )}
              </Resources>
            }
          />
        </Section>
      )}
      {Object.keys(filteredSocial).length > 0 && (
        <Section>
          <InfoPiece
            title={translateRaw('SOCIAL')}
            value={
              <>
                {filteredSocialArray.map(social => {
                  return (
                    <a key={social} href={details.social[social]} target="_blank" rel="noreferrer">
                      <Icon
                        alt={supportedSocialNetworks[social].name}
                        src={supportedSocialNetworks[social].icon}
                      />
                    </a>
                  );
                })}
              </>
            }
          />
        </Section>
      )}
    </DashboardPanel>
  );
}
