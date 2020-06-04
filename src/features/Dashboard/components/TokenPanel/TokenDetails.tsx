import React, { useContext } from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import { StoreAsset, Social } from '@types';
import { DashboardPanel, AssetIcon, Currency } from '@components';
import { getNetworkById, StoreContext, SettingsContext } from '@services/Store';
import { COLORS, FONT_SIZE, SPACING } from '@theme';
import { weiToFloat } from '@utils';
import { getFiat } from '@config/fiats';

import socialTelegram from '@assets/images/social-icons/social-telegram.svg';
import socialTwitter from '@assets/images/social-icons/social-twitter.svg';
import socialReddit from '@assets/images/social-icons/social-reddit.svg';
import socialGithub from '@assets/images/social-icons/social-github.svg';
import socialFacebook from '@assets/images/social-icons/social-facebook.svg';
import socialSlack from '@assets/images/social-icons/social-slack.svg';
import socialCmc from '@assets/images/social-icons/social-cmc.svg';
import websiteIcon from '@assets/images/icn-website.svg';
import whitepaperIcon from '@assets/images/icn-whitepaper.svg';
import backArrowIcon from '@assets/images/icn-back.svg';
import expandIcon from '@assets/images/icn-expand.svg';

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
  margin-top: ${(props) => (props.noMargin ? 0 : '23px')};
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

type ISocialNetwork = {
  [key in Social]: string;
};

const supportedSocialNetworks: ISocialNetwork = {
  [Social.TELEGRAM]: socialTelegram,
  [Social.TWITTER]: socialTwitter,
  [Social.REDDIT]: socialReddit,
  [Social.GITHUB]: socialGithub,
  [Social.FACEBOOK]: socialFacebook,
  [Social.SLACK]: socialSlack,
  [Social.CMC]: socialCmc
};

interface Props {
  currentToken: StoreAsset;
  setShowDetailsView(setShowDetailsView: boolean): void;
}

export function TokenDetails(props: Props) {
  const { currentToken, setShowDetailsView } = props;
  const {
    website,
    whitepaper,
    social,
    networkId,
    rate = 0,
    balance,
    decimal,
    ticker,
    contractAddress
  } = currentToken;
  const { networks } = useContext(StoreContext);
  const { settings } = useContext(SettingsContext);
  const network = getNetworkById(networkId, networks);

  const contractUrl = `${
    network && network.blockExplorer ? network.blockExplorer.origin : etherscanUrl
  }/token/${currentToken.contractAddress}`;

  // Find available supported social links
  const filteredSocial = social || {};
  Object.keys(filteredSocial).forEach(
    (key: Social) =>
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
            <AssetIcon uuid={currentToken.uuid} size={'30px'} />
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
          <InfoPiece
            title={translateRaw('LATEST_PRICE')}
            value={
              <Currency
                symbol={getFiat(settings).symbol}
                code={getFiat(settings).code}
                amount={rate.toString()}
                decimals={2}
              />
            }
          />{' '}
          <InfoPiece
            title={translateRaw('BALANCE')}
            value={`${weiToFloat(balance, decimal).toFixed(6)} ${ticker}`}
          />
        </TwoColumnsWrapper>
      </Section>
      <Section>
        <InfoPiece title={translateRaw('TOKEN_ADDRESS')} value={contractAddress} />
      </Section>
      <TwoColumnsWrapper>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_DECIMALS')} value={decimal} />
        </Section>
        <Section>
          <InfoPiece title={translateRaw('TOKEN_SYMBOL')} value={ticker} />
        </Section>
      </TwoColumnsWrapper>
      {Object.keys(filteredSocial).length > 0 && (
        <Section>
          <InfoPiece
            title={translateRaw('RESOURCES')}
            value={
              <>
                {website && (
                  <a href={website} target="_blank" rel="noreferrer">
                    <ResourceIcon src={websiteIcon} />
                  </a>
                )}
                {whitepaper && (
                  <a href={whitepaper} target="_blank" rel="noreferrer">
                    <ResourceIcon src={whitepaperIcon} />
                  </a>
                )}
                {social &&
                  filteredSocialArray.map((s: Social) => {
                    return (
                      <a key={s} href={social[s]} target="_blank" rel="noreferrer">
                        <SocialIcon alt={s} src={supportedSocialNetworks[s]} />
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
