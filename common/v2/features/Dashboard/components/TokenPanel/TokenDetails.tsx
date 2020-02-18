import React, { useContext } from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { AssetWithDetails, TSymbol } from 'v2/types';
import { DashboardPanel, AssetIcon } from 'v2/components';
import { getNetworkById, StoreContext } from 'v2/services/Store';
import { COLORS, FONT_SIZE, SPACING } from 'v2/theme';

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
import { weiToFloat } from 'v2/utils';

const etherscanUrl = ' https://etherscan.io';

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
`;

const InfoTitle = styled.div`
  font-size: ${FONT_SIZE.XS};
  letter-spacing: 0.1em;
  font-weight: 900;
  color: ${COLORS.GREY_DARKER};
  text-transform: uppercase;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: ${FONT_SIZE.MD};
  font-weight: normal;
  word-break: break-all;
  color: ${COLORS.GREY_DARKEST};
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

const DetailsHeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.1;
`;

const Icon = styled.img`
  height: auto;
  cursor: pointer;
  transition: 100ms transform;
  &:hover {
    transition: 100ms transform;
    transform: scale(1.1);
  }

  width: 40px;
  padding: ${SPACING.SM};
`;

const BackIcon = styled(Icon)`
  margin-left: -${SPACING.SM};
`;

const TokenIcon = styled.div`
  margin-right: ${SPACING.SM};
  display: flex;
`;

const ResourceIcon = styled(Icon)`
  width: 46px;
  margin-left: -${SPACING.SM};
  margin-right: ${SPACING.SM};
`;

const SocialIcon = styled(Icon)`
  width: 46px;
  margin-left: -${SPACING.SM};
  margin-right: ${SPACING.BASE};
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
  const { details, networkId } = currentToken;
  const { networks } = useContext(StoreContext);
  const network = getNetworkById(networkId!, networks);
  const contractUrl = `${
    network && network.blockExplorer ? network.blockExplorer.origin : etherscanUrl
  }/token/${currentToken.contractAddress}`;

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
            <AssetIcon symbol={currentToken.ticker as TSymbol} size={'30px'} />
          </TokenIcon>
          {currentToken.name}
        </DetailsHeadingWrapper>
      }
      headingRight={
        <a href={contractUrl} target="_blank" rel="noreferrer">
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
            value={`${weiToFloat(currentToken.balance, currentToken.decimal).toFixed(6)} ${
              currentToken.ticker
            }`}
          />
        </TwoColumnsWrapper>
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_ADDRESS')} value={currentToken.contractAddress} />
      </Section>
      <TwoColumnsWrapper>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_DECIMALS')} value={currentToken.decimal} />
        </Section>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_SYMBOL')} value={currentToken.ticker} />
        </Section>
      </TwoColumnsWrapper>
      {Object.keys(filteredSocial).length > 0 && (
        <Section>
          <InfoPiece
            title={translateRaw('RESOURCES')}
            value={
              <>
                {details.website && (
                  <a href={details.website} target="_blank" rel="noreferrer">
                    <ResourceIcon src={websiteIcon} />
                  </a>
                )}
                {details.whitepaper && (
                  <a href={details.whitepaper} target="_blank" rel="noreferrer">
                    <ResourceIcon src={whitepaperIcon} />
                  </a>
                )}
                {filteredSocialArray.map(social => {
                  return (
                    <a key={social} href={details.social[social]} target="_blank" rel="noreferrer">
                      <SocialIcon
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
